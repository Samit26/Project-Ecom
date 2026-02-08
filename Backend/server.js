import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import rateLimit from "express-rate-limit";
import config from "./config/config.js";
import connectDB from "./config/database.js";
import passportConfig from "./config/passport.js";
import errorHandler from "./middlewares/errorHandler.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import promoCodeRoutes from "./routes/promoCodeRoutes.js";
import shippingConfigRoutes from "./routes/shippingConfigRoutes.js";

// Initialize Express
const app = express();

// Trust proxy - Required for Render, Heroku, and other reverse proxies
// This allows Express to correctly identify client IP from X-Forwarded-For header
app.set("trust proxy", 1);

// Connect to Database
connectDB();

// Middlewares
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Logging
// Body parser - preserve raw body for webhook signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      // Store raw body buffer for routes that need signature verification (e.g., Cashfree webhooks)
      if (req.originalUrl === "/api/orders/webhook") {
        req.rawBody = buf.toString("utf8");
      }
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Cookie parser

// CORS configuration
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);

// Session configuration
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.nodeEnv === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Passport initialization
app.use(passportConfig.initialize());
app.use(passportConfig.session());

// Rate limiting - General routes
const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 800, // Limit each IP to 500 requests per 15 minutes
  message: "Too many requests, please try again later.",
});

// Rate limiting - Admin routes (higher limit)
const adminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 3000, // Higher limit for admin dashboard
  message: "Too many requests, please try again later.",
});

// Rate limiting - Auth routes (stricter for security)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Prevent brute force attacks
  message: "Too many login attempts, please try again later.",
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", generalLimiter, productRoutes);
app.use("/api/cart", generalLimiter, cartRoutes);
app.use("/api/orders", generalLimiter, orderRoutes);
app.use("/api/users", generalLimiter, userRoutes);
app.use("/api/admin", adminLimiter, adminRoutes);
app.use("/api/pages", generalLimiter, pageRoutes);
app.use("/api/categories", generalLimiter, categoryRoutes);
app.use("/api/admin/promo-codes", adminLimiter, promoCodeRoutes);
app.use("/api/promo-codes", generalLimiter, promoCodeRoutes);
app.use("/api/shipping-config", generalLimiter, shippingConfigRoutes);
app.use("/api/admin/shipping-config", shippingConfigRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-Commerce Lighting Store API",
    version: "1.0.0",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

export default app;
