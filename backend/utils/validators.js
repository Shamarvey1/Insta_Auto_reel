import { z } from 'zod';

export const generateReelSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters long'),
  duration: z.coerce.number().refine(val => [15, 30, 60].includes(val), {
    message: 'Duration must be 15, 30, or 60 seconds'
  }).default(30),
  language: z.string().default('English'),
  style: z.enum([
    'Educational',
    'Motivational',
    'Storytelling',
    'Humorous',
    'Cinematic / Dramatic',
    'Tech & Facts'
  ]).default('Educational'),
  count: z.coerce.number().min(1).max(5).default(1)
});

export const generateScriptSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters long'),
  duration: z.coerce.number().refine(val => [15, 30, 60].includes(val), {
    message: 'Duration must be 15, 30, or 60 seconds'
  }).default(30),
  language: z.string().default('English'),
  style: z.string().default('Educational'),
  selectedIdea: z.string().optional()
});

export const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }
  req.validatedBody = result.data;
  next();
};

