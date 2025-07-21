import express from 'express';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected dashboard route
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

// Get current authenticated user
router.get('/me', protect, (req, res) => {
  return res.status(200).json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
});

export default router;
