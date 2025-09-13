import express from 'express';
import passport from '../config/auth.config.js';
import { generateToken } from '../utils/generateToken.js';
import registerUser from '../controllers/auth.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
import logoutUser from '../controllers/logoutWithBusinessName.controller.js';
import cookie from 'cookie';

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      })
    );

    if (!req.user.isProfileCompleted) {
      res.redirect(`${process.env.CLIENT_URL}/complete-profile`);
    } else {
      res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    }
  }
);

router.post('/register', asyncHandler(registerUser));
router.post('/logout', asyncHandler(logoutUser));
export default router;