import express from "express";
import * as categoryController from "../controllers/categoryController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategory);

// Admin routes
router.post("/", authenticate, isAdmin, categoryController.createCategory);
router.put("/:id", authenticate, isAdmin, categoryController.updateCategory);
router.delete("/:id", authenticate, isAdmin, categoryController.deleteCategory);
router.patch(
  "/:id/toggle-status",
  authenticate,
  isAdmin,
  categoryController.toggleCategoryStatus,
);

export default router;
