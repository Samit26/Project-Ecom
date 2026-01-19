import express from "express";
import * as promoCodeController from "../controllers/promoCodeController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/validate", promoCodeController.validatePromoCode);
router.get("/homepage", promoCodeController.getHomePagePromoCode);

// Admin routes
router.use(authenticate);
router.use(isAdmin);

router.get("/", promoCodeController.getAllPromoCodes);
router.post("/", promoCodeController.createPromoCode);
router.put("/:id", promoCodeController.updatePromoCode);
router.delete("/:id", promoCodeController.deletePromoCode);
router.patch("/:id/toggle", promoCodeController.togglePromoCodeStatus);

export default router;
