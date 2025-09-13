import express from 'express';
import { getMe, updateUserProfile } from '../controllers/user.controller.js';
import protect from '../middlewares/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/me', protect, asyncHandler(getMe));

router.patch('/me', protect, asyncHandler(updateUserProfile));

export default router;