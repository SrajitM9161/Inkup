import express from 'express';
import multer from 'multer';
import protect from '../middlewares/authMiddleware.js';
import { saveProject, getMyProjects, getProjectById } from '../controllers/project.controller.js';

const router = express.Router();

const upload = multer({ dest: 'Public/temp' });

router.post(
  '/', 
  protect, 
  upload.fields([
    { name: 'previewImage', maxCount: 1 },
    { name: 'baseImage', maxCount: 1 }
  ]), 
  saveProject
);

router.get('/', protect, getMyProjects);
router.get('/:projectId', protect, getProjectById);

export default router;