import express from "express";
import {
  getPageContent,
  getAllPages,
  updatePageContent,
  submitContactForm,
  getContactSubmissions,
  updateContactSubmission,
} from "../controllers/pageController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/:pageType", getPageContent);
router.post("/contact/submit", submitContactForm);

// Admin routes
router.get("/", authenticate, isAdmin, getAllPages);
router.put("/:pageType", authenticate, isAdmin, updatePageContent);
router.get(
  "/contact/submissions",
  authenticate,
  isAdmin,
  getContactSubmissions,
);
router.put(
  "/contact/submissions/:id",
  authenticate,
  isAdmin,
  updateContactSubmission,
);

export default router;
