import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { createPaymentOrder, verifyPayment } from "../utils/paymentHelper.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phoneNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping address with name and phone number is required",
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
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
      if (
        !product.stock.isAvailable ||
        product.stock.quantity < item.quantity
      ) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock or insufficient quantity`,
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

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shippingAddress,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { "stock.quantity": -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
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
      "name images"
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
      }
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
      (p) => p.payment_status === "SUCCESS"
    );

    if (successfulPayment) {
      order.paymentStatus = "completed";
      order.paymentId = successfulPayment.cf_payment_id;
      order.orderStatus = "processing";
      await order.save();

      // Clear user's cart
      await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { items: [], totalAmount: 0 }
      );

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
