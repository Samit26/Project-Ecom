import mongoose from "mongoose";

const shippingConfigSchema = new mongoose.Schema(
  {
    baseShippingFee: {
      type: Number,
      required: [true, "Base shipping fee is required"],
      min: 0,
      default: 50,
    },
    freeShippingThreshold: {
      type: Number,
      required: [true, "Free shipping threshold is required"],
      min: 0,
      default: 1000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const ShippingConfig = mongoose.model("ShippingConfig", shippingConfigSchema);

export default ShippingConfig;
