const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const { User, validateRegisterUser } = require("../models/User");
// register new user
// route POST /api/auth/register

module.exports.registerUserctrl = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // if user exists
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // create new user
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  // save user
  await user.save();
  // send response to client
  res
    .status(201)
    .json({ message: "User created successfully , please login!" });
});
