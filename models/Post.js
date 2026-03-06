const mongoose = require("mongoose");
const joi = require("joi");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
    },
    image: {
      type: Object,
      required: true,
      default: {
        url: "",
        publicId: null,
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", PostSchema);

function validateCreatePost(obj) {
  const schema = joi.object({
    title: joi.string().trim().min(2).max(100).required(),
    description: joi.string().trim().min(10).required(),
    category: joi.string().trim().required(),
  });
  return schema.validate(obj);
}
function validateUpdatePost(obj) {
  const schema = joi.object({
    title: joi.string().trim().min(2).max(100),
    description: joi.string().trim().min(10),
    category: joi.string().trim(),
  });
  return schema.validate(obj);
}
module.exports = {
  Post,
  validateCreatePost,
  validateUpdatePost,
};
