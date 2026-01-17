import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);

export default router;
