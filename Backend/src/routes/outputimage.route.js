import express from 'express';
import  getUserOutputImages  from '../controllers/getUserOutputImages.controller.js';

const router = express.Router();

router.get('/user/:userId/outputs', getUserOutputImages);

export default router;
