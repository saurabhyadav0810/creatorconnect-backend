import express from "express";
import {
	initiateSignup,
	verifySignupOtp,
	login,
	getCurrentUser
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/signup/initiate", initiateSignup);
router.post("/signup/verify", verifySignupOtp);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);

export default router;
