import { generateToken } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import config from "../config/config.js";

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// @desc    Google OAuth Success
// @route   GET /api/auth/google/callback
// @access  Public
export const googleAuthCallback = (req, res) => {
  try {
    // Generate JWT token
    const token = generateToken(req.user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect to frontend
    res.redirect(`${config.clientUrl}?token=${token}`);
  } catch (error) {
    res.redirect(`${config.clientUrl}/login?error=auth_failed`);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req, res) => {
  try {
    res.clearCookie("token");

    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error logging out",
        });
      }

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
};
