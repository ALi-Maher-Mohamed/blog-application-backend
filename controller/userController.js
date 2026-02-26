const { User } = require("../models/User");
const asyncHandler = require("express-async-handler");

// get all users
module.exports.getAllUsersctrl = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});
// get users count

module.exports.getUsersCountctrl = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json(count);
});
// get user profile
module.exports.getUserProfilectrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});
