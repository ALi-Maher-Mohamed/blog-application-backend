const mongoose = require("mongoose");

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
      type: object,
      default: {
        url: "https://pixabay.com/illustrations/icon-profile-user-clip-art-7797704/",
        pulicId: null,
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

// user model
const User = mongoose.model("User", UserSchema);
module.exports = User;
