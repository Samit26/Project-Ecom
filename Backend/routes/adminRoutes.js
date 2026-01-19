import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
} from "../controllers/productController.js";
import {
  getAllOrders,
  getOrderByNumber,
  updateOrderStatus,
  getDashboardStats,
} from "../controllers/adminController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";
import { validate, productSchema } from "../middlewares/validation.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Product Management
router.post(
  "/products",
  upload.array("images", 9),
  validate(productSchema),
  createProduct,
);
router.put("/products/:id", upload.array("images", 9), updateProduct);
router.delete("/products/:id", deleteProduct);
router.patch("/products/:id/featured", toggleFeatured);

// Order Management
router.get("/orders", getAllOrders);
router.get("/orders/:orderNumber", getOrderByNumber);
router.put("/orders/:id/status", updateOrderStatus);

// Dashboard Stats
router.get("/dashboard/stats", getDashboardStats);

export default router;
