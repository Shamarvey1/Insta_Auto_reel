import express from 'express';
import { validateRequest, generateReelSchema, generateScriptRequestSchema } from '../utils/validators.js';
import * as reelController from '../controllers/reelController.js';

const router = express.Router();

router.post('/generate', validateRequest(generateReelSchema), reelController.generateReel);
router.post('/generate-script', validateRequest(generateScriptRequestSchema), reelController.generateScriptOnly);
router.get('/:id/status', reelController.getReelStatus);
router.get('/', reelController.getAllReels);
router.get('/:id', reelController.getReelById);
router.get('/:id/download', reelController.downloadReel);

export default router;
