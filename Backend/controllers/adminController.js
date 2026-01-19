import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      orderStatus,
      paymentStatus,
      sortBy = "createdAt",
      order = "desc",
      search,
      startDate,
      endDate,
    } = req.query;

    // Build query
    const query = {};

    if (orderStatus) {
      query.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Search by order number
    if (search) {
      query.orderNumber = { $regex: search, $options: "i" };
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDateTime;
      }
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    // Pagination
    const skip = (page - 1) * limit;
    const totalItems = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const orders = await Order.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("userId", "name email")
      .populate("items.productId", "name");

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics (Admin)
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Get current month start date
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    // Total earnings (all delivered orders)
    const deliveredOrders = await Order.find({
      orderStatus: "delivered",
      paymentStatus: "completed",
    });
    const totalEarnings = deliveredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    // This month earnings
    const thisMonthOrders = await Order.find({
      orderStatus: "delivered",
      paymentStatus: "completed",
      createdAt: { $gte: firstDayOfMonth },
    });
    const thisMonthEarnings = thisMonthOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    // Orders completed
    const ordersCompleted = await Order.countDocuments({
      orderStatus: "delivered",
    });

    // Orders cancelled
    const ordersCancelled = await Order.countDocuments({
      orderStatus: "cancelled",
    });

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Pending orders
    const pendingOrders = await Order.countDocuments({
      orderStatus: "pending",
    });

    // Total products
    const totalProducts = await Product.countDocuments();

    // Total users
    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      data: {
        totalEarnings,
        thisMonthEarnings,
        ordersCompleted,
        ordersCancelled,
        totalOrders,
        pendingOrders,
        totalProducts,
        totalUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};
