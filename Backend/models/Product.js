import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length <= 9;
        },
        message: "Maximum 9 images allowed",
      },
      default: [],
    },
    pricing: {
      originalPrice: {
        type: Number,
        required: [true, "Original price is required"],
        min: 0,
      },
      offerPrice: {
        type: Number,
        required: [true, "Offer price is required"],
        min: 0,
      },
    },
    stock: {
      type: String,
      enum: ["available", "not available"],
      default: "available",
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    category: {
      type: String,
      enum: ["LED Lights", "Smart Lighting", "Decorative", "Outdoor"],
      required: [true, "Category is required"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filter
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
