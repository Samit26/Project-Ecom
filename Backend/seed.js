import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import User from "./models/User.js";
import connectDB from "./config/database.js";

dotenv.config();

// Sample products data
const sampleProducts = [
  {
    name: "LED Smart Bulb 9W",
    description:
      "Energy-efficient smart LED bulb with WiFi connectivity and voice control support. Compatible with Alexa and Google Home.",
    images: ["https://images.unsplash.com/photo-1550985616-10810253b84d?w=500"],
    pricing: {
      originalPrice: 599,
      offerPrice: 399,
    },
    stock: {
      isAvailable: true,
      quantity: 150,
    },
    rating: 4.5,
    category: "Smart Lighting",
    isFeatured: true,
  },
  {
    name: "Crystal Chandelier",
    description:
      "Elegant crystal chandelier perfect for living rooms and dining areas. Features premium quality crystals and durable construction.",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500",
    ],
    pricing: {
      originalPrice: 12999,
      offerPrice: 8999,
    },
    stock: {
      isAvailable: true,
      quantity: 25,
    },
    rating: 4.8,
    category: "Decorative",
    isFeatured: true,
  },
  {
    name: "Outdoor Garden Light Set",
    description:
      "Set of 6 solar-powered garden lights. Weather-resistant design with automatic on/off sensor.",
    images: [
      "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=500",
    ],
    pricing: {
      originalPrice: 2499,
      offerPrice: 1799,
    },
    stock: {
      isAvailable: true,
      quantity: 80,
    },
    rating: 4.3,
    category: "Outdoor",
    isFeatured: true,
  },
  {
    name: "LED Strip Lights 5M",
    description:
      "RGB LED strip lights with remote control. Perfect for home decoration and ambient lighting.",
    images: ["https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=500"],
    pricing: {
      originalPrice: 999,
      offerPrice: 699,
    },
    stock: {
      isAvailable: true,
      quantity: 200,
    },
    rating: 4.6,
    category: "LED Lights",
    isFeatured: true,
  },
  {
    name: "Modern Ceiling Light",
    description:
      "Sleek and modern ceiling light fixture. Energy-efficient LED technology with warm white light.",
    images: [
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500",
    ],
    pricing: {
      originalPrice: 3499,
      offerPrice: 2499,
    },
    stock: {
      isAvailable: true,
      quantity: 60,
    },
    rating: 4.4,
    category: "LED Lights",
    isFeatured: false,
  },
  {
    name: "Smart LED Panel 12W",
    description:
      "Ultra-slim LED panel light with adjustable brightness and color temperature. Smart app control.",
    images: [
      "https://images.unsplash.com/photo-1585128733008-a3326199a5e6?w=500",
    ],
    pricing: {
      originalPrice: 1999,
      offerPrice: 1499,
    },
    stock: {
      isAvailable: true,
      quantity: 100,
    },
    rating: 4.7,
    category: "Smart Lighting",
    isFeatured: false,
  },
  {
    name: "Vintage Table Lamp",
    description:
      "Decorative vintage-style table lamp. Perfect for bedside or study desk. Includes LED bulb.",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
    ],
    pricing: {
      originalPrice: 1599,
      offerPrice: 1199,
    },
    stock: {
      isAvailable: true,
      quantity: 45,
    },
    rating: 4.2,
    category: "Decorative",
    isFeatured: false,
  },
  {
    name: "Waterproof LED Floodlight 50W",
    description:
      "High-power LED floodlight for outdoor security and illumination. IP65 waterproof rating.",
    images: [
      "https://images.unsplash.com/photo-1565008507372-09c7796eebfa?w=500",
    ],
    pricing: {
      originalPrice: 2999,
      offerPrice: 2199,
    },
    stock: {
      isAvailable: true,
      quantity: 50,
    },
    rating: 4.5,
    category: "Outdoor",
    isFeatured: false,
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("🗑️  Clearing existing products...");
    await Product.deleteMany({});

    console.log("🌱 Seeding products...");
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ ${products.length} products created successfully!`);

    console.log("\n📦 Sample Products:");
    products.forEach((product, index) => {
      console.log(
        `${index + 1}. ${product.name} - ₹${product.pricing.offerPrice}`
      );
    });

    console.log("\n✨ Database seeded successfully!");
    console.log("\n💡 Tips:");
    console.log("- Login with Google OAuth to create a user");
    console.log(
      '- Update user role to "admin" in MongoDB to access admin features'
    );
    console.log("- Featured products will appear on the homepage");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
