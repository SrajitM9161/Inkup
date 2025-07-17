import express from 'express';
import upload from '../middlewares/mutlter.middleware.js';
import  { createGeneration } from '../controllers/generation.Controller.js';
import   {protect} from '../middlewares/authMiddleware.js';
const router = express.Router();


const multiUpload = upload.fields([
  { name: 'userImage', maxCount:1 },
  { name: 'itemImage', maxCount: 5 }
]);

router.post('/generate', protect, multiUpload, createGeneration);

export default router;
