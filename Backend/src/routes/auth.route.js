// Backend/src/routes/auth.route.js
import express from 'express';
import passport from '../config/auth.config.js';
import jwt from 'jsonwebtoken';
import { registerUser } from '../controllers/auth.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

router.post('/register', asyncHandler(registerUser));

export default router;
