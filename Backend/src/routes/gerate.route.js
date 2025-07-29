import express from 'express';
import upload from '../middlewares/mutlter.middleware.js';
import { uploadUserImage, uploadItemImage } from '../controllers/generation.Controller.js';
import  protect  from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/user-image', protect, upload.single('userImage'), uploadUserImage);
router.post('/item-image', protect, upload.single('itemImage'), uploadItemImage);

export default router;