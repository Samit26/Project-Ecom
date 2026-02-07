import crypto from "crypto";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import PromoCode from "../models/PromoCode.js";
import ShippingConfig from "../models/ShippingConfig.js";
import User from "../models/User.js";
import { createPaymentOrder, verifyPayment } from "../utils/paymentHelper.js";
import {
  sendOrderNotificationToAdmin,
  sendOrderConfirmationToCustomer,
} from "../utils/emailHelper.js";
import config from "../config/config.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, promoCode } = req.body;

    console.log("Received order request:", JSON.stringify(req.body, null, 2));

    // Validate shipping address
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    if (!shippingAddress.name || !shippingAddress.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Recipient name is required in shipping address",
      });
    }

    if (!shippingAddress.phoneNumber || !shippingAddress.phoneNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required in shipping address",
      });
    }

    // Remove hyphens, spaces, and other formatting characters from phone number
    shippingAddress.phoneNumber = shippingAddress.phoneNumber.replace(
      /[-\s()]/g,
      "",
    );

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Verify stock availability for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product.stock !== "available") {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }
    }

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      quantity: item.quantity,
      price: item.price,
      image: item.productId.images[0] || "",
    }));

    // Calculate subtotal
    const subtotal = cart.totalAmount;

    // Apply promo code if provided
    let promoCodeDiscount = 0;
    let promoCodeId = null;
    if (promoCode) {
      const promo = await PromoCode.findOne({
        code: promoCode.toUpperCase(),
        isActive: true,
      });

      if (promo) {
        const now = new Date();
        if (
          now >= promo.validFrom &&
          now <= promo.validUntil &&
          subtotal >= promo.minOrderAmount &&
          (!promo.usageLimit || promo.usedCount < promo.usageLimit)
        ) {
          if (promo.discountType === "percentage") {
            promoCodeDiscount = (subtotal * promo.discountValue) / 100;
            if (promo.maxDiscountAmount) {
              promoCodeDiscount = Math.min(
                promoCodeDiscount,
                promo.maxDiscountAmount,
              );
            }
          } else {
            promoCodeDiscount = promo.discountValue;
          }
          promoCodeId = promo._id;

          // Increment usage count
          await PromoCode.findByIdAndUpdate(promo._id, {
            $inc: { usedCount: 1 },
          });
        }
      }
    }

    // Calculate shipping fee
    const shippingConfig = await ShippingConfig.findOne({ isActive: true });
    const amountAfterDiscount = subtotal - promoCodeDiscount;
    const shippingFee =
      shippingConfig &&
      amountAfterDiscount >= shippingConfig.freeShippingThreshold
        ? 0
        : shippingConfig?.baseShippingFee || 50;

    // Calculate total
    const totalAmount = amountAfterDiscount + shippingFee;

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      subtotal,
      shippingFee,
      promoCode: promoCodeId,
      promoCodeDiscount: Math.round(promoCodeDiscount),
      totalAmount: Math.round(totalAmount),
      shippingAddress,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        stock: "available", // Stock management simplified
      });
    }

    // Don't clear the cart yet - only clear after successful payment
    // Cart will be cleared by frontend after payment confirmation

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name images");

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId",
      "name images",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order belongs to user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// @desc    Process payment
// @route   POST /api/orders/:id/payment
// @access  Private
export const processPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order belongs to user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (order.paymentStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed",
      });
    }

    // Create Cashfree payment order
    const paymentResult = await createPaymentOrder(
      order.orderNumber,
      order.totalAmount,
      {
        customerId: req.user.id,
        email: req.user.email,
        phone: order.shippingAddress.phoneNumber,
        name: order.shippingAddress.name,
      },
    );

    if (!paymentResult.success) {
      return res.status(500).json({
        success: false,
        message: "Error creating payment",
        error: paymentResult.error,
      });
    }

    res.json({
      success: true,
      message: "Payment session created",
      data: {
        paymentSessionId: paymentResult.data.payment_session_id,
        orderId: order.orderNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing payment",
      error: error.message,
    });
  }
};

// @desc    Verify payment
// @route   POST /api/orders/:id/verify-payment
// @access  Private
export const verifyPaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify payment with Cashfree
    const verificationResult = await verifyPayment(order.orderNumber);

    if (!verificationResult.success) {
      return res.status(500).json({
        success: false,
        message: "Error verifying payment",
        error: verificationResult.error,
      });
    }

    const payments = verificationResult.data;
    const successfulPayment = payments.find(
      (p) => p.payment_status === "SUCCESS",
    );

    if (successfulPayment) {
      order.paymentStatus = "completed";
      order.paymentId = successfulPayment.cf_payment_id;
      // Only set to processing if order is currently pending
      // Don't overwrite shipped/delivered/cancelled statuses
      if (order.orderStatus === "pending") {
        order.orderStatus = "processing";
      }
      await order.save();

      // Clear user's cart
      await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { items: [], totalAmount: 0 },
      );

      // NOTE: Emails are sent by the webhook handler, not here
      // This prevents duplicate emails since webhook is the authoritative source

      res.json({
        success: true,
        message: "Payment verified successfully",
        data: order,
      });
    } else {
      order.paymentStatus = "failed";
      await order.save();

      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

// @desc    Handle Cashfree payment webhook
// @route   POST /api/orders/webhook
// @access  Public (No auth - called by Cashfree)
export const handlePaymentWebhook = async (req, res) => {
  try {
    // CRITICAL SECURITY: Verify webhook signature from Cashfree
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    if (!signature || !timestamp) {
      console.error("Missing webhook signature or timestamp");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - missing signature",
      });
    }

    // Generate signature to compare
    const signatureData = timestamp + JSON.stringify(req.body);
    const generatedSignature = crypto
      .createHmac("sha256", config.cashfree.secretKey)
      .update(signatureData)
      .digest("base64");

    // Verify signature matches
    if (signature !== generatedSignature) {
      console.error("Invalid webhook signature - possible attack attempt");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid signature",
      });
    }

    console.log("Webhook received:", JSON.stringify(req.body, null, 2));

    const webhookData = req.body;
    const { type, data } = webhookData;

    // Handle payment success webhook
    if (type === "PAYMENT_SUCCESS_WEBHOOK") {
      const { order_id, payment } = data?.order || data;
      const orderId = order_id;

      if (!orderId) {
        console.error("No order_id in webhook data");
        return res
          .status(400)
          .json({ success: false, message: "Missing order_id" });
      }

      // Find order by orderNumber and lock it to prevent race conditions
      const order = await Order.findOne({ orderNumber: orderId });

      if (!order) {
        console.error(`Order not found: ${orderId}`);
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      // Check if payment is already completed (webhook deduplication)
      if (order.paymentStatus === "completed") {
        console.log(
          `Payment already processed for order ${orderId}, ignoring duplicate webhook`,
        );
        return res
          .status(200)
          .json({ success: true, message: "Already processed" });
      }

      // Use findOneAndUpdate with a condition to ensure atomic update (prevents race conditions)
      const updatedOrder = await Order.findOneAndUpdate(
        {
          orderNumber: orderId,
          paymentStatus: { $ne: "completed" }, // Only update if not already completed
        },
        {
          $set: {
            paymentStatus: "completed",
            paymentId: payment?.cf_payment_id || data?.payment?.cf_payment_id,
            orderStatus: "processing",
          },
        },
        { new: true },
      );

      // If updatedOrder is null, it means another webhook already processed this
      if (!updatedOrder) {
        console.log(
          `Payment already processed by concurrent webhook for order ${orderId}`,
        );
        return res
          .status(200)
          .json({ success: true, message: "Already processed" });
      }

      // Clear user's cart (now using updatedOrder)
      await Cart.findOneAndUpdate(
        { userId: updatedOrder.userId },
        { items: [], totalAmount: 0 },
      );

      // Get user details for email
      const user = await User.findById(updatedOrder.userId);

      if (user) {
        // Prepare email data
        const emailData = {
          orderNumber: updatedOrder.orderNumber,
          createdAt: updatedOrder.createdAt,
          paymentStatus: updatedOrder.paymentStatus,
          orderStatus: updatedOrder.orderStatus,
          items: updatedOrder.items,
          subtotal: updatedOrder.subtotal,
          shippingFee: updatedOrder.shippingFee,
          promoCodeDiscount: updatedOrder.promoCodeDiscount || 0,
          totalAmount: updatedOrder.totalAmount,
          shippingAddress: updatedOrder.shippingAddress,
          customerEmail: user.email,
        };

        // Send emails (don't wait for them)
        sendOrderNotificationToAdmin(emailData).catch((error) =>
          console.error("Failed to send admin notification:", error),
        );
        sendOrderConfirmationToCustomer(emailData).catch((error) =>
          console.error("Failed to send customer confirmation:", error),
        );
      }

      console.log(`Payment completed for order ${orderId}`);

      // Always respond with success to Cashfree
      return res.status(200).json({ success: true });
    }

    // Handle payment failure webhook
    if (type === "PAYMENT_FAILED_WEBHOOK") {
      const { order_id } = data?.order || data;
      const orderId = order_id;

      if (orderId) {
        const order = await Order.findOne({ orderNumber: orderId });
        if (order && order.paymentStatus !== "completed") {
          order.paymentStatus = "failed";
          await order.save();
          console.log(`Payment failed for order ${orderId}`);
        }
      }

      return res.status(200).json({ success: true });
    }

    // For other webhook types, just acknowledge
    console.log(`Received webhook type: ${type}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Always return 200 to Cashfree to avoid retries
    return res.status(200).json({ success: true });
  }
};
