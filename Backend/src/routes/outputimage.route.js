import express from 'express';
import getUserOutputImages from '../controllers/getUserOutputImages.controller.js';
import getUserEditOutputImages from '../controllers/getUserEditOutputImage.controller.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/user/outputs', protect, getUserOutputImages);
router.get('/user/outputs/edit', protect, getUserEditOutputImages);

export default router;
