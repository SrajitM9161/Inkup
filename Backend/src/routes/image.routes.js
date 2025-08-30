import express from "express";
import { generateImage } from "../controllers/promt_imageController.js";

const router = express.Router();

router.post("/generate", generateImage);

export default router;
