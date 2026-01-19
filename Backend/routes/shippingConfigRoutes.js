import express from "express";
import * as shippingConfigController from "../controllers/shippingConfigController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", shippingConfigController.getShippingConfig);
router.post("/calculate", shippingConfigController.calculateShippingFee);

// Admin routes
router.put(
  "/",
  authenticate,
  isAdmin,
  shippingConfigController.updateShippingConfig,
);

export default router;
