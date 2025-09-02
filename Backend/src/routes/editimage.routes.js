import express from "express";
import { editImage } from "../controllers/promt_imageController.js";

const router = express.Router();

router.post("/edit", editImage);

export default router;
