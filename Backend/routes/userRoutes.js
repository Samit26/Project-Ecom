import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { validate, updateProfileSchema } from "../middlewares/validation.js";

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

router.get("/profile", getUserProfile);
router.put("/profile", validate(updateProfileSchema), updateUserProfile);

export default router;
