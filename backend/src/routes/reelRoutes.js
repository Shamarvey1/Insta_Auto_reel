import express from 'express';
import { validateBody, createReelSchema } from '../utils/validators.js';
import * as reelController from '../controllers/reelController.js';

const router = express.Router();

router.post('/generate', validateBody(createReelSchema), reelController.generateReel);
router.get('/', reelController.getReels);
router.get('/:id', reelController.getReelById);
router.get('/:id/status', reelController.getReelStatus);
router.get('/:id/download', reelController.downloadReel);

export default router;
