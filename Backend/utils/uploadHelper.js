import cloudinary from "../config/cloudinary.js";

// Upload single image to Cloudinary
export const uploadImage = async (fileBuffer, folder = "products") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `ecom-lighting/${folder}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      )
      .end(fileBuffer);
  });
};

// Upload multiple images
export const uploadMultipleImages = async (files, folder = "products") => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises = files.map((file) => uploadImage(file.buffer, folder));
  return await Promise.all(uploadPromises);
};

// Delete image from Cloudinary
export const deleteImage = async (imageUrl) => {
  try {
    // Extract public_id from URL
    const parts = imageUrl.split("/");
    const fileName = parts[parts.length - 1];
    const publicId = `ecom-lighting/products/${fileName.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
};
