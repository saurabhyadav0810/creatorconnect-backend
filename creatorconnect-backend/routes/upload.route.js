import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { uploadMedia, uploadMultipleMedia } from "../controllers/upload.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/single", authMiddleware, upload.single("file"), uploadMedia);

router.post("/multiple", authMiddleware, upload.array("files", 10), uploadMultipleMedia);

export default router;
