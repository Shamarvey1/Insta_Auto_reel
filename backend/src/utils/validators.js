import { z } from 'zod';

export const createReelSchema = z.object({
  topic: z.string().trim().min(3, 'Topic must be at least 3 characters long'),
  duration: z.coerce.number().refine(val => [15, 30, 45, 60].includes(val), {
    message: 'Duration must be 15, 30, 45, or 60 seconds'
  }).default(30),
  language: z.enum(['Hindi', 'Hinglish', 'English']).default('Hinglish'),
  style: z.enum(['Educational', 'Documentary', 'Cinematic', 'Storytelling', 'Motivation']).default('Educational'),
  visualStyle: z.enum(['Realistic', '3D', 'Anime', 'Cinematic']).default('Cinematic'),
  aspectRatio: z.literal('9:16').default('9:16')
});

export const sceneSchema = z.object({
  sceneNumber: z.number().int().positive(),
  duration: z.number().positive(),
  narration: z.string().min(1),
  visualPrompt: z.string().min(1),
  videoPrompt: z.string().min(1),
  subtitle: z.string().min(1),
  transition: z.string().default('fade')
});

export const scriptOutputSchema = z.object({
  title: z.string().min(1),
  topic: z.string().min(1),
  language: z.string().min(1),
  style: z.string().min(1),
  targetDuration: z.number().positive(),
  scenes: z.array(sceneSchema).min(1),
  ending: z.string().min(1),
  callToAction: z.string().min(1)
});

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }
  req.validatedBody = result.data;
  next();
};
