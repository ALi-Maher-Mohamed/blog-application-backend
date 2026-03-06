const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minLength: 5,
      maxLength: 100,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
    },
    profilePhoto: {
      url: {
        type: String,
        default: "data:image/jpeg;base64,...",
      },
      publicId: {
        type: String,
        default: null,
      },
    },
    bio: {
      type: String,
      // default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// valdate register user
function validateRegisterUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(2).max(100).required(),
    email: joi.string().trim().min(5).max(255).required().email(),
    password: joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}
function validateLoginUser(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(255).required().email(),
    password: joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}
// validate update user
function validateUpdateUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(2).max(100),
    password: joi.string().trim().min(8),
    bio: joi.string(),
  });
  return schema.validate(obj);
}
// generate token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
  );
};
// user model
const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
  validateUpdateUser,
  validateLoginUser,
  validateRegisterUser,
};
