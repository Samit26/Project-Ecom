import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  processPayment,
  verifyPaymentStatus,
} from "../controllers/orderController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { validate, orderSchema } from "../middlewares/validation.js";

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

router.post("/", validate(orderSchema), createOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrderById);
router.post("/:id/payment", processPayment);
router.post("/:id/verify-payment", verifyPaymentStatus);

export default router;
