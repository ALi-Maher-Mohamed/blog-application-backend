const asyncHandler = require("express-async-handler");
const {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} = require("../models/Comments");
const { User } = require("../models/User");

// create new comment   api / comments

module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const profile = await User.findById(req.user.id);
  const comment = await Comment.create({
    postId: req.body.postId,
    text: req.body.text,
    user: req.user.id,
    userName: profile.username,
  });
  res.status(201).json(comment);
});
// get all commets api / comments

module.exports.getAllCommentsCtrl = asyncHandler(async (req, res) => {
  const comments = await Comment.find().populate("user", ["-password"]);
  res.status(200).json(comments);
});

// delete comment api / comments/:id

module.exports.deleteCommentCtrl = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (req.user.id === comment.user.toString() || req.user.isAdmin) {
    await comment.deleteOne(req.params);
    res.status(200).json({ message: "Comment deleted" });
  } else {
    res.status(403).json({
      message: "Access Denied, you are not allowed to delete this comment",
    });
  }
  res.status(200).json({ message: "Comment deleted" });
});

// update comment api / comments/:id

module.exports.updateCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (req.user.id !== comment.user.toString()) {
    return res.status(403).json({
      message: "Access Denied, you are not allowed to update this comment",
    });
  }
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        text: req.body.text,
      },
    },
    { new: true },
  ).populate("user", ["-password"]);
  res.status(200).json(updatedComment);
});
