const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
} = require("../models/User");
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

// login user
// route POST /api/auth/login
module.exports.loginUserctrl = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //  * if user not found
  const user = await User.findOne({ email: req.body.email });
  //  * if password not correct
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  //  * if password not correct
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password,
  );
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // @TODO: send email to user(verfiy account)
  const token = user.generateAuthToken();
  //  * generate token
  //  send response to client
  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,

    token,
  });
});

// update user profile
module.exports.updateUserProfilectrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      username: req.body.username,
      password: req.body.password,
      bio: req.body.bio,
    },
    new: true,
  }).select("-password");

  res.status(200).json(updatedUser);
});
