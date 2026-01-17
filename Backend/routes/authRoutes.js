import express from "express";
import passport from "passport";
import {
  getCurrentUser,
  googleAuthCallback,
  logout,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleAuthCallback
);

// Get current user
router.get("/me", authenticate, getCurrentUser);

// Logout
router.post("/logout", authenticate, logout);

export default router;
