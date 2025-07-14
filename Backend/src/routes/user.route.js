
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, async (req, res) => {
  return res.json({
    message: 'Welcome to your profile',
    user: req.user, // contains decoded user info from token
  });
});

export default router;
