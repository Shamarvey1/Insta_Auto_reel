import express from 'express';
import * as mediaController from '../controllers/mediaController.js';

const router = express.Router();

router.get('/providers/status', mediaController.getProvidersStatus);
router.get('/comfyui/models', mediaController.getComfyUIModels);
router.post('/generate-image', mediaController.generateImage);
router.post('/generate-video', mediaController.generateVideo);

export default router;
