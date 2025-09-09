import express from "express";
import { editImage } from "../controllers/promt_imageController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/edit", protect, editImage);

export default router;
