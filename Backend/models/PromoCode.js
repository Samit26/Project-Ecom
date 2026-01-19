import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Promo code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
      min: 0,
    },
    usageLimit: {
      type: Number,
      default: null,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    showOnHomePage: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Validate that validUntil is after validFrom
promoCodeSchema.pre("save", function (next) {
  if (this.validUntil <= this.validFrom) {
    next(new Error("Valid until date must be after valid from date"));
  }
  next();
});

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

export default PromoCode;
