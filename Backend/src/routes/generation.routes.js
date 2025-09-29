import express from 'express';
import multer from 'multer';
import protect from '../middlewares/authMiddleware.js';
import { saveUserGeneration } from '../controllers/generation.Controller.js';

const router = express.Router();

const upload = multer({ dest: 'Public/temp' });

router.post(
  '/', 
  protect, 
  upload.single('generation'), 
  saveUserGeneration
);

export default router;