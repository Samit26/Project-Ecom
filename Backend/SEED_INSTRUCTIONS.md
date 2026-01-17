# Product Seeding Instructions

## Overview

The `seedProducts.js` script will upload 30 products with real images from the `Images` folder to your database using the Admin API. This ensures all images are properly uploaded to Cloudinary.

## Prerequisites

1. **Server must be running**

   ```bash
   npm run dev
   ```

   The server should be running on the configured port (default: 5000)

2. **Admin user must exist**
   You need to have an admin user in your database. If you don't have one, create it first.

3. **Admin password in .env**
   Add your admin password to the `.env` file:

   ```
   ADMIN_PASSWORD=your_admin_password
   ```

   Or the script will use the default: `Admin@123`

## Running the Script

### Step 1: Start the server

```bash
npm run dev
```

### Step 2: In a new terminal, run the seed script

```bash
node seedProducts.js
```

## What the Script Does

1. **Authenticates as admin** - Logs in using admin credentials
2. **Deletes existing products** - Removes all products currently in the database
3. **Uploads new products** - Creates 30 products with:
   - Product details (name, description, pricing, category, etc.)
   - Random images (1-9 per product) from the `Images` folder
   - Images uploaded to Cloudinary via the admin API

## Expected Output

```
Getting admin authentication...
Admin authenticated successfully

Deleting X existing products...
All existing products deleted

Starting to upload 30 products...

[1/30] Uploading: Modern LED Ceiling Light...
  ✓ Success - 5 images uploaded
[2/30] Uploading: Smart RGB Bulb...
  ✓ Success - 3 images uploaded
...

==================================================
SEEDING COMPLETE!
==================================================
✓ Successfully created: 30 products

Product Summary:
- LED Lights: 8
- Smart Lighting: 7
- Decorative: 8
- Outdoor: 7

Featured Products: 7
Out of Stock: 4
```

## Troubleshooting

### Error: "No admin user found"

- Create an admin user first through your registration system
- Set the user's role to "admin" in the database

### Error: "Login failed"

- Check that `ADMIN_PASSWORD` in `.env` matches your admin user's password
- Verify the admin user's email in the database

### Error: "ECONNREFUSED"

- Make sure the server is running
- Check that the PORT in `.env` matches the server's port

### Error: "No images found in Images folder"

- Verify that the `Backend/Images` folder exists
- Check that it contains image files (.jpg, .jpeg, .png, .gif, .webp)

## Notes

- The script uses the Images folder in the Backend directory
- Each product gets a random selection of 1-9 images
- Images are uploaded to Cloudinary, not stored locally
- The process may take a few minutes depending on image sizes and internet speed
