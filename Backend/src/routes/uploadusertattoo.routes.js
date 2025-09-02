
import express from 'express';
import upload from '../middlewares/mutlter.middleware.js';
import { uploadTattoo,getUserTattoos } from '../controllers/tattooUpload.controller.js';
import  protect  from '../middlewares/authMiddleware.js';
const router = express.Router();

// upload tattoo image
router.post("/upload", protect, upload.array("tattoos", 10), uploadTattoo);

// Get all tattoos for user (GET)
router.get("/my-tattoos", protect, getUserTattoos);

export default router;
