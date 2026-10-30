import Groq from 'groq-sdk';
import { SCRIPT_WRITER_SYSTEM_PROMPT, buildScriptUserPrompt } from '../utils/prompts.js';
import { scriptOutputSchema } from '../utils/validators.js';

export const generateReelScript = async ({ topic, duration, language = 'Hinglish', style = 'Educational' }) => {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  const model = process.env.GROQ_MODEL?.trim() || 'llama-3.3-70b-versatile';

  if (!apiKey || apiKey === 'your_api_key' || apiKey.startsWith('your_')) {
    const error = new Error('Groq API key is not configured. Please set a valid GROQ_API_KEY in backend/.env');
    error.statusCode = 401;
    throw error;
  }

  const client = new Groq({ apiKey });

  let rawContent = '';
  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SCRIPT_WRITER_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: buildScriptUserPrompt({ topic, duration, language, style })
        }
      ],
      model,
      temperature: 0.6,
      max_tokens: 2500,
      response_format: { type: 'json_object' }
    });

    rawContent = chatCompletion.choices[0]?.message?.content?.trim() || '';
    if (!rawContent) {
      const error = new Error('No content returned from Groq API');
      error.statusCode = 502;
      throw error;
    }
  } catch (apiError) {
    if (apiError.status === 401 || apiError.statusCode === 401) {
      const error = new Error('Invalid Groq API key. Please check your credentials in backend/.env');
      error.statusCode = 401;
      throw error;
    }
    if (apiError.status === 429) {
      const error = new Error('Groq API rate limit reached. Please retry in a few moments.');
      error.statusCode = 429;
      throw error;
    }
    if (apiError.status === 404) {
      const error = new Error(`Specified Groq model "${model}" was not found or is unavailable.`);
      error.statusCode = 400;
      throw error;
    }
    const error = new Error(apiError.message || 'Error communicating with Groq API');
    error.statusCode = apiError.status || 500;
    throw error;
  }

  let cleaned = rawContent;
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(new RegExp('^```(?:json)?\\s*', 'i'), '').replace(new RegExp('\\s*```$', ''), '').trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseError) {
    const error = new Error('Groq model produced malformed JSON that could not be parsed');
    error.statusCode = 502;
    error.details = {
      rawOutputPreview: rawContent.substring(0, 300),
      parserError: parseError.message
    };
    throw error;
  }

  const validationResult = scriptOutputSchema.safeParse(parsed);
  if (!validationResult.success) {
    const error = new Error('Generated script failed schema validation');
    error.statusCode = 502;
    error.details = validationResult.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    throw error;
  }

  return validationResult.data;
};
