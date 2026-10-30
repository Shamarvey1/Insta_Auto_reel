import express from 'express';
import * as jobController from '../controllers/jobController.js';

const router = express.Router();

router.get('/:jobId', jobController.getJobStatus);
router.post('/:jobId/retry', jobController.retryJob);

export default router;
