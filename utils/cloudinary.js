const cloudinary = require("cloudinary");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// upload image
const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Interner Server Error (cloudinary000)");
  }
};

const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    if (!imagePublicId) {
      console.log("No publicId provided");
      return;
    }

    const data = await cloudinary.uploader.destroy(imagePublicId);
    return data;
  } catch (error) {
    console.log("Cloudinary Delete Error:", error);
    throw new Error("Internal Server Error (cloudinary)");
  }
};
const cloudinaryRemoveMultipleImage = async (publicIds) => {
  try {
    const data = await cloudinary.api.delete_resources(publicIds);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Interner Server Error (cloudinary222)");
  }
};

module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveMultipleImage,
  cloudinaryRemoveImage,
};
