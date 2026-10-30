import Anthropic from '@anthropic-ai/sdk';
import { SCRIPT_WRITER_SYSTEM_PROMPT, buildScriptUserPrompt } from '../utils/prompts.js';
import { scriptOutputSchema } from '../utils/validators.js';

export const generateReelScript = async ({ topic, duration, language, style }) => {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  const model = process.env.ANTHROPIC_MODEL?.trim() || 'claude-3-5-sonnet-20241022';

  if (!apiKey || apiKey === 'your_api_key') {
    const error = new Error('Anthropic API key is not configured. Please set a valid ANTHROPIC_API_KEY in backend/.env');
    error.statusCode = 401;
    throw error;
  }

  const client = new Anthropic({ apiKey });

  let rawContent = '';
  try {
    const response = await client.messages.create({
      model,
      max_tokens: 2500,
      temperature: 0.7,
      system: SCRIPT_WRITER_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildScriptUserPrompt({ topic, duration, language, style })
        }
      ]
    });

    const textBlock = response.content?.find(block => block.type === 'text');
    if (!textBlock || !textBlock.text) {
      const error = new Error('No text content returned from Claude API');
      error.statusCode = 502;
      throw error;
    }

    rawContent = textBlock.text.trim();
  } catch (apiError) {
    if (apiError.status === 401 || apiError.statusCode === 401) {
      const error = new Error('Invalid Anthropic API key. Please check your credentials.');
      error.statusCode = 401;
      throw error;
    }
    if (apiError.status === 429) {
      const error = new Error('Anthropic API rate limit exceeded. Please retry in a few moments.');
      error.statusCode = 429;
      throw error;
    }
    if (apiError.status === 404) {
      const error = new Error(`Specified Claude model "${model}" was not found or is unavailable.`);
      error.statusCode = 400;
      throw error;
    }
    const error = new Error(apiError.message || 'Error communicating with Claude API');
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
    const error = new Error('AI model produced malformed JSON that could not be parsed');
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
