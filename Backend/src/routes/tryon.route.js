import express from 'express';
import multer from 'multer';
import { generateTryon } from '../controllers/tryon.controller.js';
import protect from '../middlewares/authMiddleware.js';
import { getTryonImage } from '../controllers/getTryonImage.controller.js';
import { image1kProcessor } from '../middlewares/image1kProcessor.middleware.js';
const router = express.Router();
const upload = multer({ dest: 'Public/temp' });

router.post(
  '/tryon',
  protect,
  upload.fields([
    { name: 'humanImage', maxCount: 1 },
    { name: 'tattooImage', maxCount: 1 },
    { name: 'maskImage', maxCount: 1 },
  ]),
   image1kProcessor,
  generateTryon
);
router.get("/image/:generationId", protect, getTryonImage);
export default router;
