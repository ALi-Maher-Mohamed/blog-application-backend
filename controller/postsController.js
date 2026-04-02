const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const { Comment } = require("../models/Comments");
const {
  Post,
  validateCreatePost,
  validateUpdatePost,
} = require("../models/Post");

/**
 * @desc    Generate AI Content (Write Post)
 * @route   POST /api/posts/ai-write
 * @access  private (Logged in user only)
 */
module.exports.aiWritePostCtrl = asyncHandler(async (req, res) => {
  const { title } = req.body;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a professional content writer. Write a long blog post in simple English. Do NOT use any HTML tags, Markdown, or special formatting. Provide only plain text organized into clear paragraphs.",
          },
          {
            role: "user",
            content: `Write a blog post about: ${title}`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const aiText = response.data.choices[0].message.content;

    // إرسال النص الصافي للفرونت إند
    res.status(200).json({ aiContent: aiText });
  } catch (err) {
    console.error("Groq Write Error:", err.response?.data || err.message);
    res
      .status(500)
      .json({ message: "Failed to generate content, please try again later." });
  }
});

/**
 * @desc    Generate AI Summary
 * @route   POST /api/posts/ai-summarize
 * @access  private (Logged in user only)
 */
module.exports.aiSummarizeCtrl = asyncHandler(async (req, res) => {
  const { description } = req.body;
  if (!description || description.length < 100) {
    return res
      .status(400)
      .json({ message: "Description must be at least 100 characters" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "أنت خبير في تحسين محركات البحث. لخص المقال في سطرين بأسلوب مشوق.",
          },
          {
            role: "user",
            content: `لخص هذا المقال: ${description}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const summary = response.data.choices[0].message.content.trim();
    res.status(200).json({ summary });
  } catch (err) {
    console.error("Groq Summarize Error:", err.response?.data || err.message);
    res.status(500).json({ message: "فشل في تلخيص المقال" });
  }
});

// --- بقية الـ Controllers الأساسية (Create, Get, Delete, Update) ---

module.exports.createPostctrl = asyncHandler(async (req, res) => {
  // 1. التأكد من وجود الملف
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // 2. التحقق من البيانات
  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 3. الحل السحري: نستخدم المسار اللي multer وفرهولنا أياً كان مكانه
  // ده هيشتغل لوكال (images) وهيشتغل على فيرسيل (tmp)
  const imagePath = req.file.path;

  // 4. الرفع لكلاوديناري
  const result = await cloudinaryUploadImage(imagePath);

  // 5. حفظ في الداتابيز
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

  // 6. الرد على الكلاينت أولاً
  res.status(201).json(post);

  // 7. مسح الملف المؤقت عشان السيرفر يفضل نضيف
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
});

module.exports.getAllPostsctrl = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;

  if (pageNumber) {
    const page = Math.max(1, parseInt(pageNumber));
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .populate("user", ["-password"]);
  } else if (category) {
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  }
  res.status(200).json(posts);
});

module.exports.getSingelPostctrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("user", ["-password"])
    .populate("comments");
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(200).json(post);
});

module.exports.getPostCountctrl = asyncHandler(async (req, res) => {
  const count = await Post.countDocuments();
  res.status(200).json(count);
});

module.exports.deletePostctrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (req.user.id == post.user.toString() || req.user.isAdmin) {
    await Post.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(post.image.publicId);
    await Comment.deleteMany({ postId: post._id });
    res.status(200).json({ message: "Post deleted successfully" });
  } else {
    res.status(403).json({ message: "Access Denied" });
  }
});

module.exports.updatePostImageCtrl = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (req.user.id !== post.user.toString())
    return res.status(403).json({ message: "Access Denied" });

  await cloudinaryRemoveImage(post.image.publicId);
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { $set: { image: { url: result.secure_url, publicId: result.public_id } } },
    { new: true },
  );
  res.status(200).json(updatedPost);
  fs.unlinkSync(imagePath);
});

module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {
  const loggedInUser = req.user.id;
  const { id: postId } = req.params;
  let post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const isPostAlreadyLiked = post.likes.find(
    (user) => user.toString() === loggedInUser,
  );

  if (isPostAlreadyLiked) {
    post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: loggedInUser } },
      { new: true },
    );
  } else {
    post = await Post.findByIdAndUpdate(
      postId,
      { $push: { likes: loggedInUser } },
      { new: true },
    );
  }
  res.status(200).json(post);
});

module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdatePost(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (req.user.id !== post.user.toString())
    return res.status(403).json({ message: "Access Denied" });

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true },
  )
    .populate("user", ["-password"])
    .populate("comments");

  res.status(200).json(updatedPost);
});
