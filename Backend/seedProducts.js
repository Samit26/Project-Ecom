import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadImage } from "./utils/uploadHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Sample product data with 30 different products
const products = [
  {
    name: "Modern LED Ceiling Light",
    description:
      "Energy-efficient LED ceiling light with adjustable brightness. Perfect for living rooms and bedrooms. Features smart dimming technology and long-lasting bulbs.",
    pricing: { originalPrice: 89.99, offerPrice: 69.99 },
    category: "LED Lights",
    stock: "available",
    rating: 4.5,
    isFeatured: true,
    imageCount: 5,
  },
  {
    name: "Smart RGB Bulb",
    description:
      "WiFi-enabled smart bulb with 16 million color options. Control via smartphone app or voice commands. Compatible with Alexa and Google Home.",
    pricing: { originalPrice: 49.99, offerPrice: 39.99 },
    category: "Smart Lighting",
    stock: "available",
    rating: 4.8,
    isFeatured: true,
    imageCount: 3,
  },
  {
    name: "Vintage Edison Bulb Set",
    description:
      "Pack of 6 vintage-style Edison bulbs with warm amber glow. Perfect for industrial and retro-themed interiors.",
    pricing: { originalPrice: 59.99, offerPrice: 49.99 },
    category: "Decorative",
    stock: "available",
    rating: 4.3,
    imageCount: 4,
  },
  {
    name: "Outdoor Solar Garden Lights",
    description:
      "Set of 8 solar-powered garden pathway lights. Waterproof and weather-resistant. Automatic on/off at dusk and dawn.",
    pricing: { originalPrice: 79.99, offerPrice: 59.99 },
    category: "Outdoor",
    stock: "available",
    rating: 4.6,
    imageCount: 7,
  },
  {
    name: "Crystal Chandelier",
    description:
      "Elegant crystal chandelier with 8 lights. Premium K9 crystal droplets create stunning light effects. Perfect for dining rooms and foyers.",
    pricing: { originalPrice: 299.99, offerPrice: 249.99 },
    category: "Decorative",
    stock: "not available",
    rating: 4.9,
    isFeatured: true,
    imageCount: 6,
  },
  {
    name: "LED Strip Lights 16ft",
    description:
      "RGB LED strip lights with remote control. 16 feet long with adhesive backing. Multiple color modes and brightness levels.",
    pricing: { originalPrice: 34.99, offerPrice: 24.99 },
    category: "LED Lights",
    stock: "available",
    rating: 4.4,
    imageCount: 5,
  },
  {
    name: "Motion Sensor Outdoor Light",
    description:
      "Security light with motion sensor and adjustable sensitivity. 180-degree detection range. Weatherproof aluminum construction.",
    pricing: { originalPrice: 69.99, offerPrice: 54.99 },
    category: "Outdoor",
    stock: "available",
    rating: 4.5,
    imageCount: 4,
  },
  {
    name: "Smart Desk Lamp",
    description:
      "Minimalist smart desk lamp with touch controls and USB charging port. Adjustable color temperature from warm to cool white.",
    pricing: { originalPrice: 79.99, offerPrice: 64.99 },
    category: "Smart Lighting",
    stock: "available",
    rating: 4.7,
    isFeatured: true,
    imageCount: 9,
  },
  {
    name: "Moroccan Pendant Light",
    description:
      "Handcrafted Moroccan-style pendant light with intricate metalwork. Creates beautiful shadow patterns on walls and ceiling.",
    pricing: { originalPrice: 129.99, offerPrice: 99.99 },
    category: "Decorative",
    stock: "available",
    rating: 4.6,
    imageCount: 5,
  },
  {
    name: "LED Panel Light 2x2",
    description:
      "Commercial-grade LED panel light for offices and commercial spaces. Ultra-thin design with uniform light distribution.",
    pricing: { originalPrice: 89.99, offerPrice: 74.99 },
    category: "LED Lights",
    stock: "available",
    rating: 4.4,
    imageCount: 3,
  },
  {
    name: "Smart WiFi Light Switch",
    description:
      "Replace your traditional switch with smart WiFi control. Schedule lights, voice control compatible, no hub required.",
    pricing: { originalPrice: 39.99, offerPrice: 29.99 },
    category: "Smart Lighting",
    stock: "available",
    rating: 4.5,
    imageCount: 4,
  },
  {
    name: "LED Flood Light 100W",
    description:
      "Powerful 100W LED flood light for outdoor areas. IP66 waterproof rating. Ideal for gardens, parking lots, and building facades.",
    pricing: { originalPrice: 119.99, offerPrice: 89.99 },
    category: "Outdoor",
    stock: "available",
    rating: 4.7,
    imageCount: 6,
  },
  {
    name: "Fairy String Lights",
    description:
      "100 LED warm white fairy lights on copper wire. Battery-powered with timer function. Perfect for weddings and parties.",
    pricing: { originalPrice: 24.99, offerPrice: 19.99 },
    category: "Decorative",
    stock: "available",
    rating: 4.8,
    isFeatured: true,
    imageCount: 8,
  },
  {
    name: "Track Lighting Kit",
    description:
      "4-light adjustable track lighting kit. Sleek modern design with directional spotlights. Easy installation.",
    pricing: { originalPrice: 159.99, offerPrice: 129.99 },
    category: "LED Lights",
    stock: "not available",
    rating: 4.3,
    imageCount: 5,
  },
  {
    name: "Smart Light Bulb Starter Pack",
    description:
      "Starter pack of 4 smart bulbs with hub included. Full spectrum color and white light. Easy setup and control.",
    pricing: { originalPrice: 149.99, offerPrice: 119.99 },
    category: "Smart Lighting",
    stock: "available",
    rating: 4.6,
    isFeatured: true,
    imageCount: 6,
  },
  {
    name: "Industrial Cage Pendant",
    description:
      "Vintage industrial cage pendant light. Adjustable height with Edison bulb included. Perfect for kitchen islands.",
    pricing: { originalPrice: 79.99, offerPrice: 64.99 },
    category: "Decorative",
    stock: "available",
    rating: 4.5,
    imageCount: 4,
  },
  {
    name: "LED Recessed Lighting 6-Pack",
    description:
      "Set of 6 dimmable LED recessed lights. Ultra-slim profile fits in tight spaces. Energy Star certified.",
    pricing: { originalPrice: 129.99, offerPrice: 99.99 },
    category: "LED Lights",
    stock: "available",
    rating: 4.7,
    imageCount: 3,
  },
  {
    name: "Solar LED String Lights",
    description:
      "50ft solar-powered outdoor string lights with 25 LED bulbs. Weather-resistant and shatterproof. Perfect for patios.",
    pricing: { originalPrice: 89.99, offerPrice: 69.99 },
    category: "Outdoor",
    stock: "available",
    rating: 4.6,
    imageCount: 7,
  },
  {
    name: "Smart Motion Night Light",
    description:
      "Motion-activated LED night light with adjustable brightness. Rechargeable battery. Perfect for hallways and bathrooms.",
    pricing: { originalPrice: 29.99, offerPrice: 22.99 },
    category: "Smart Lighting",
    stock: "available",
    rating: 4.4,
    imageCount: 5,
  },
  {
    name: "Neon LED Sign Custom",
    description:
      "Customizable LED neon sign. Multiple color options. Low energy consumption and long-lasting. Great for businesses and home decor.",
    pricing: { originalPrice: 199.99, offerPrice: 159.99 },
    category: "Decorative",
    stock: "not available",
    rating: 4.9,
    isFeatured: true,
    imageCount: 9,
  },
  {
    name: "LED Under Cabinet Lighting",
    description:
      "Linkable under cabinet LED light bars. Touch dimmer included. Perfect for kitchen countertops and workspaces.",
    pricing: { originalPrice: 54.99, offerPrice: 44.99 },
    category: "LED Lights",
    stock: "available",
    rating: 4.5,
    imageCount: 4,
  },
  {
    name: "Outdoor Wall Sconce Set",
    description:
      "Set of 2 modern outdoor wall sconces. Dusk-to-dawn sensor included. Weather-resistant powder-coated finish.",
    pricing: { originalPrice: 139.99, offerPrice: 109.99 },
    category: "Outdoor",
    stock: "available",
    rating: 4.6,
    imageCount: 6,
  },
  {
    name: "Smart Ceiling Fan with Light",
    description:
      "52-inch ceiling fan with integrated LED light and remote control. WiFi-enabled for smartphone and voice control.",
    pricing: { originalPrice: 249.99, offerPrice: 199.99 },
    category: "Smart Lighting",
    stock: "available",
    rating: 4.8,
    isFeatured: true,
    imageCount: 8,
  },
  {
    name: "Art Deco Table Lamp",
    description:
      "Elegant Art Deco style table lamp with brass finish. Frosted glass shade creates soft ambient light.",
    pricing: { originalPrice: 89.99, offerPrice: 74.99 },
    category: "Decorative",
    stock: "available",
    rating: 4.4,
    imageCount: 5,
  },
  {
    name: "LED Corn Bulb 100W",
    description:
      "High-output LED corn bulb equivalent to 400W traditional. E26 base. Ideal for warehouses and large spaces.",
    pricing: { originalPrice: 44.99, offerPrice: 34.99 },
    category: "LED Lights",
    stock: "available",
    rating: 4.3,
    imageCount: 3,
  },
  {
    name: "Landscape Spotlight Kit",
    description:
      "6-pack LED landscape spotlights with stakes. Adjustable beam angle. IP65 waterproof for year-round use.",
    pricing: { originalPrice: 99.99, offerPrice: 79.99 },
    category: "Outdoor",
    stock: "available",
    rating: 4.7,
    imageCount: 7,
  },
  {
    name: "Smart Dimmer Switch",
    description:
      "WiFi smart dimmer switch compatible with LED, CFL, and incandescent bulbs. Schedule and remote control via app.",
    pricing: { originalPrice: 49.99, offerPrice: 39.99 },
    category: "Smart Lighting",
    stock: "available",
    rating: 4.6,
    imageCount: 4,
  },
  {
    name: "Himalayan Salt Lamp",
    description:
      "Authentic Himalayan salt crystal lamp. Natural pink color creates warm, soothing ambiance. Health benefits included.",
    pricing: { originalPrice: 39.99, offerPrice: 29.99 },
    category: "Decorative",
    stock: "available",
    rating: 4.5,
    imageCount: 5,
  },
  {
    name: "LED Work Light Portable",
    description:
      "Rechargeable portable LED work light. 3 brightness modes. Magnetic base and hook for hands-free use.",
    pricing: { originalPrice: 34.99, offerPrice: 27.99 },
    category: "LED Lights",
    stock: "not available",
    rating: 4.4,
    imageCount: 6,
  },
  {
    name: "Globe String Lights",
    description:
      "25ft outdoor globe string lights with 25 G40 bulbs. Connectable up to 3 strands. Perfect for outdoor entertaining.",
    pricing: { originalPrice: 44.99, offerPrice: 34.99 },
    category: "Outdoor",
    stock: "available",
    rating: 4.8,
    imageCount: 9,
  },
];

// Function to get random image files from Images folder
function getRandomImageFiles(count) {
  const imagesDir = path.join(__dirname, "Images");

  // Read all files from Images directory
  const allImages = fs.readdirSync(imagesDir).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
  });

  if (allImages.length === 0) {
    console.warn("No images found in Images folder");
    return [];
  }

  // Randomly select images
  const selectedImages = [];
  const imagesToSelect = Math.min(count, allImages.length);
  const shuffled = [...allImages].sort(() => 0.5 - Math.random());

  for (let i = 0; i < imagesToSelect; i++) {
    selectedImages.push(path.join(imagesDir, shuffled[i]));
  }

  return selectedImages;
}

// Upload images to Cloudinary
async function uploadImagesToCloudinary(imagePaths) {
  const uploadedUrls = [];

  for (const imagePath of imagePaths) {
    try {
      const fileBuffer = fs.readFileSync(imagePath);
      const imageUrl = await uploadImage(fileBuffer, "products");
      uploadedUrls.push(imageUrl);
    } catch (error) {
      console.error(`Failed to upload ${imagePath}:`, error.message);
    }
  }

  return uploadedUrls;
}

// Create product with uploaded images
async function createProductWithImages(productData, imagePaths) {
  // Upload images to Cloudinary
  const imageUrls = await uploadImagesToCloudinary(imagePaths);

  // Remove imageCount from product data
  const { imageCount: _, ...cleanProductData } = productData;

  // Create product with Cloudinary URLs
  const product = await Product.create({
    ...cleanProductData,
    images: imageUrls,
  });

  return product;
}

// Connect to MongoDB and seed products
const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce"
    );

    console.log("Connected to MongoDB\n");

    // Delete all existing products
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`Deleting ${existingCount} existing products...`);
      await Product.deleteMany({});
      console.log("All existing products deleted\n");
    }

    let successCount = 0;
    let failCount = 0;

    console.log(
      `Starting to upload ${products.length} products to Cloudinary...\n`
    );

    // Create products one by one
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      try {
        // Get random images
        const imageCount =
          product.imageCount || Math.floor(Math.random() * 9) + 1;
        const imagePaths = getRandomImageFiles(imageCount);

        console.log(
          `[${i + 1}/${products.length}] Uploading: ${product.name}...`
        );

        const createdProduct = await createProductWithImages(
          product,
          imagePaths
        );

        console.log(
          `  ✓ Success - ${createdProduct.images.length} images uploaded to Cloudinary`
        );
        successCount++;
      } catch (error) {
        console.log(`  ✗ Failed - ${error.message}`);
        failCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("SEEDING COMPLETE!");
    console.log("=".repeat(50));
    console.log(`✓ Successfully created: ${successCount} products`);
    if (failCount > 0) {
      console.log(`✗ Failed: ${failCount} products`);
    }

    // Get final stats
    const allProducts = await Product.find({});

    console.log("\nProduct Summary:");
    console.log(
      `- LED Lights: ${
        allProducts.filter((p) => p.category === "LED Lights").length
      }`
    );
    console.log(
      `- Smart Lighting: ${
        allProducts.filter((p) => p.category === "Smart Lighting").length
      }`
    );
    console.log(
      `- Decorative: ${
        allProducts.filter((p) => p.category === "Decorative").length
      }`
    );
    console.log(
      `- Outdoor: ${allProducts.filter((p) => p.category === "Outdoor").length}`
    );
    console.log(
      `\nFeatured Products: ${allProducts.filter((p) => p.isFeatured).length}`
    );
    console.log(
      `Out of Stock: ${
        allProducts.filter((p) => p.stock === "not available").length
      }`
    );

    // Display first 3 products as sample
    console.log("\nSample Products:");
    allProducts.slice(0, 3).forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   Category: ${product.category}`);
      console.log(
        `   Price: $${product.pricing.offerPrice} (was $${product.pricing.originalPrice})`
      );
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Images: ${product.images.length}`);
      if (product.images.length > 0) {
        console.log(`   First Image: ${product.images[0]}`);
      }
    });

    await mongoose.connection.close();
    console.log("\n✓ Database connection closed");
  } catch (error) {
    console.error("\n❌ Error seeding products:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run the seed script
seedProducts();
