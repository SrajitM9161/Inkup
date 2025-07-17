import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, (req, res) => {
  return res.json({
    message: 'Secure dashboard data',
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

// ✅ Add this route to verify token (used by frontend hook)
router.get('/me', protect, (req, res) => {
  return res.status(200).json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
});

export default router;
