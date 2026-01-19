import User from "../models/User.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-__v");

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address, city, state, pincode } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phoneNumber) {
      // Remove hyphens, spaces, and other formatting characters
      updateData.phoneNumber = phoneNumber.replace(/[-\s()]/g, "");
    }

    // Handle address - support both object and individual fields
    if (address) {
      if (typeof address === "object" && !Array.isArray(address)) {
        updateData.address = address;
      } else {
        updateData["address.street"] = address;
      }
    }
    if (city) updateData["address.city"] = city;
    if (state) updateData["address.state"] = state;
    if (pincode) {
      updateData["address.pincode"] = pincode;
      updateData["address.zipCode"] = pincode; // Also set zipCode for compatibility
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-__v");

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
