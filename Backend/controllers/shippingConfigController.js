import ShippingConfig from "../models/ShippingConfig.js";

// @desc    Get shipping configuration
// @route   GET /api/shipping-config
// @access  Public
export const getShippingConfig = async (req, res) => {
  try {
    let config = await ShippingConfig.findOne({ isActive: true });

    // Create default config if none exists
    if (!config) {
      config = await ShippingConfig.create({
        baseShippingFee: 50,
        freeShippingThreshold: 1000,
        isActive: true,
      });
    }

    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shipping configuration",
      error: error.message,
    });
  }
};

// @desc    Update shipping configuration (Admin)
// @route   PUT /api/admin/shipping-config
// @access  Private/Admin
export const updateShippingConfig = async (req, res) => {
  try {
    const { baseShippingFee, freeShippingThreshold } = req.body;

    let config = await ShippingConfig.findOne({ isActive: true });

    if (!config) {
      config = await ShippingConfig.create({
        baseShippingFee,
        freeShippingThreshold,
        isActive: true,
      });
    } else {
      config.baseShippingFee = baseShippingFee;
      config.freeShippingThreshold = freeShippingThreshold;
      await config.save();
    }

    res.json({
      success: true,
      message: "Shipping configuration updated successfully",
      data: config,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error updating shipping configuration",
    });
  }
};

// @desc    Calculate shipping fee
// @route   POST /api/shipping-config/calculate
// @access  Public
export const calculateShippingFee = async (req, res) => {
  try {
    const { orderAmount } = req.body;

    const config = await ShippingConfig.findOne({ isActive: true });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Shipping configuration not found",
      });
    }

    const shippingFee =
      orderAmount >= config.freeShippingThreshold ? 0 : config.baseShippingFee;

    res.json({
      success: true,
      data: {
        shippingFee,
        isFreeShipping: shippingFee === 0,
        freeShippingThreshold: config.freeShippingThreshold,
        baseShippingFee: config.baseShippingFee,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error calculating shipping fee",
      error: error.message,
    });
  }
};
