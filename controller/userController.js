const { User } = require("../models/User");
const asyncHandler = require("express-async-handler");
const path = require("path");
const {
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
  cloudinaryUploadImage,
} = require("../utils/cloudinary");
const fs = require("fs");
const { Post } = require("../models/Post");
const { Comment } = require("../models/Comments");

// get all users
module.exports.getAllUsersctrl = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").populate("posts");
  res.status(200).json(users);
});
// get users count

module.exports.getUsersCountctrl = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json(count);
});
// get user profile
module.exports.getUserProfilectrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("posts");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});

// profile photo upload
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // upload image to cloudinary
  const result = await cloudinaryUploadImage(imagePath);

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // delete old photo if exists
  if (user.profilePhoto.publicId) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  // update only fields inside object
  user.profilePhoto.url = result.secure_url;
  user.profilePhoto.publicId = result.public_id;

  await user.save();

  // delete local image
  fs.unlinkSync(imagePath);

  res.status(200).json({
    message: "Profile photo uploaded successfully",
    profilePhoto: user.profilePhoto,
  });
});

// delete user profile
// route DELETE /api/users/profile/:id
module.exports.deleteUserProfilectrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // get all post from db
  const post = await Post.find({ user: user._id });

  // delete all post images from cloudinary
  const publicIds = post?.map((p) => p.image.publicId);
  if (publicIds?.length > 0) {
    await cloudinaryRemoveMultipleImage(publicIds);
  }
  await cloudinaryRemoveImage(user.profilePhoto.publicId);
  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });
  await user.deleteOne();

  res.status(200).json({ message: "User deleted successfully" });
});
