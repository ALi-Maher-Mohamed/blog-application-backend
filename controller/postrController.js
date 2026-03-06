const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const { cloudinaryUploadImage } = require("../utils/cloudinary");
const { Post, validateCreatePost } = require("../models/Post");

// create new post
//  route POST /api/posts

module.exports.createPostctrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // upload image to cloudinary
  const result = await cloudinaryUploadImage(imagePath);

  // create new post

  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
    category: req.body.category,
    user: req.user.id,
  });
  await post.save();
  res.status(201).json(post);
  // delete local image
  fs.unlinkSync(imagePath);
});

// get all posts
module.exports.getAllPostsctrl = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;
  if (pageNumber) {
    posts = await Post.find()
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .populate("user", ["-password"]);
  } else if (category) {
    posts = await Post.find({ category }).populate("user", ["-password"]);
  } else {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  }
  res.status(200).json(posts);
});

module.exports.getSingelPostctrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user", [
    "-password",
  ]);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(200).json(post);
});

module.exports.getPostCountctrl = asyncHandler(async (req, res) => {
  const count = await Post.countDocuments();
  res.status(200).json(count);
});
