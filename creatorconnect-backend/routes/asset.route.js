import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createAsset,
  getMyAssets,
  getPublicAssets
} from "../controllers/asset.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createAsset);
router.get("/my", authMiddleware, getMyAssets);
router.get("/public", getPublicAssets);

export default router;
