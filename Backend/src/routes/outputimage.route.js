import express from 'express';
import getUserOutputImages from '../controllers/getUserOutputImages.controller.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/user/outputs', protect, getUserOutputImages);

export default router;
