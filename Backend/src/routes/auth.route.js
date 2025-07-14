import express from 'express';
import { ExpressAuth } from '@auth/express';
import { authConfig } from '../config/auth.config.js';
import { registerUser } from '../controllers/auth.controller.js';
import asyncHandler from'../utils/asyncHandler.js';
const router = express.Router();

router.use('/auth', ExpressAuth(authConfig));
router.post('/register', asyncHandler(registerUser));
export default router;
