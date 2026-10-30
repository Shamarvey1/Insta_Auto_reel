import { z } from 'zod';

export const generateScriptRequestSchema = z.object({
  topic: z.string({
    required_error: 'Topic is required',
    invalid_type_error: 'Topic must be a string'
  }).trim().min(3, 'Topic must be at least 3 characters long'),
  duration: z.coerce.number().refine(val => [15, 30, 60].includes(val), {
    message: 'Duration must be 15, 30, or 60 seconds'
  }).default(30),
  language: z.string().default('English'),
  style: z.enum([
    'Educational',
    'Storytelling',
    'Motivational',
    'Entertainment'
  ], {
    errorMap: () => ({ message: 'Style must be Educational, Storytelling, Motivational, or Entertainment' })
  }).default('Educational')
});

export const sceneSchema = z.object({
  sceneNumber: z.number().int().positive(),
  duration: z.number().positive(),
  narration: z.string().min(1, 'Narration cannot be empty'),
  visualDescription: z.string().min(1, 'Visual description cannot be empty'),
  subtitle: z.string().min(1, 'Subtitle cannot be empty'),
  searchKeywords: z.array(z.string()).min(1, 'At least one search keyword is required')
});

export const scriptOutputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  topic: z.string().min(1, 'Topic is required'),
  language: z.string().min(1, 'Language is required'),
  style: z.string().min(1, 'Style is required'),
  targetDuration: z.number().positive(),
  hook: z.string().min(1, 'Hook is required'),
  scenes: z.array(sceneSchema).min(1, 'At least one scene is required'),
  ending: z.string().min(1, 'Ending thought is required'),
  callToAction: z.string().min(1, 'Call to action is required')
});

export const generateReelSchema = z.object({
  topic: z.string().trim().min(3, 'Topic must be at least 3 characters long'),
  duration: z.coerce.number().refine(val => [15, 30, 60].includes(val), {
    message: 'Duration must be 15, 30, or 60 seconds'
  }).default(30),
  language: z.string().default('English'),
  style: z.enum([
    'Educational',
    'Storytelling',
    'Motivational',
    'Entertainment'
  ]).default('Educational'),
  count: z.coerce.number().min(1).max(5).default(1)
});

export const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errorDetails = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errorDetails
    });
  }
  req.validatedBody = result.data;
  next();
};
