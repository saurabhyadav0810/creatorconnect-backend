import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getConversations, getMessages, createConversation } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/", protect, getConversations);
router.post("/conversation", protect, createConversation);
router.get("/:conversationId", protect, getMessages);

export default router;
