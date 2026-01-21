import PromoCode from "../models/PromoCode.js";

// @desc    Get homepage promo code (Public)
// @route   GET /api/promo-codes/homepage
// @access  Public
export const getHomePagePromoCode = async (req, res) => {
  try {
    const now = new Date();

    // Set time to start of day for validFrom and end of day for validUntil comparison
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const promoCode = await PromoCode.findOne({
      showOnHomePage: true,
      isActive: true,
      validFrom: { $lte: endOfToday },
      validUntil: { $gte: startOfToday },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: promoCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching homepage promo code",
      error: error.message,
    });
  }
};

// @desc    Get all promo codes (Admin)
// @route   GET /api/admin/promo-codes
// @access  Private/Admin
export const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: promoCodes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching promo codes",
      error: error.message,
    });
  }
};

// @desc    Create promo code (Admin)
// @route   POST /api/admin/promo-codes
// @access  Private/Admin
export const createPromoCode = async (req, res) => {
  try {
    // If showOnHomePage is true, unset it from all other promo codes
    if (req.body.showOnHomePage) {
      await PromoCode.updateMany({}, { showOnHomePage: false });
    }

    const promoCode = await PromoCode.create(req.body);

    res.status(201).json({
      success: true,
      message: "Promo code created successfully",
      data: promoCode,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error creating promo code",
    });
  }
};

// @desc    Update promo code (Admin)
// @route   PUT /api/admin/promo-codes/:id
// @access  Private/Admin
export const updatePromoCode = async (req, res) => {
  try {
    // If showOnHomePage is true, unset it from all other promo codes
    if (req.body.showOnHomePage) {
      await PromoCode.updateMany(
        { _id: { $ne: req.params.id } },
        { showOnHomePage: false },
      );
    }

    const promoCode = await PromoCode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: "Promo code not found",
      });
    }

    res.json({
      success: true,
      message: "Promo code updated successfully",
      data: promoCode,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error updating promo code",
    });
  }
};

// @desc    Delete promo code (Admin)
// @route   DELETE /api/admin/promo-codes/:id
// @access  Private/Admin
export const deletePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: "Promo code not found",
      });
    }

    res.json({
      success: true,
      message: "Promo code deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting promo code",
      error: error.message,
    });
  }
};

// @desc    Validate and apply promo code (Public)
// @route   POST /api/promo-codes/validate
// @access  Public
export const validatePromoCode = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: "Invalid promo code",
      });
    }

    // Check if promo code is within valid date range
    const now = new Date();
    if (now < promoCode.validFrom || now > promoCode.validUntil) {
      return res.status(400).json({
        success: false,
        message: "Promo code has expired or is not yet valid",
      });
    }

    // Check usage limit
    if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Promo code usage limit reached",
      });
    }

    // Check minimum order amount
    if (orderAmount < promoCode.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${promoCode.minOrderAmount} required`,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discountType === "percentage") {
      discountAmount = (orderAmount * promoCode.discountValue) / 100;
      if (promoCode.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, promoCode.maxDiscountAmount);
      }
    } else {
      discountAmount = promoCode.discountValue;
    }

    res.json({
      success: true,
      message: "Promo code applied successfully",
      data: {
        code: promoCode.code,
        discountAmount: Math.round(discountAmount),
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error validating promo code",
      error: error.message,
    });
  }
};

// @desc    Toggle promo code status (Admin)
// @route   PATCH /api/admin/promo-codes/:id/toggle
// @access  Private/Admin
export const togglePromoCodeStatus = async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: "Promo code not found",
      });
    }

    promoCode.isActive = !promoCode.isActive;
    await promoCode.save();

    res.json({
      success: true,
      message: `Promo code ${promoCode.isActive ? "activated" : "deactivated"} successfully`,
      data: promoCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling promo code status",
      error: error.message,
    });
  }
};
