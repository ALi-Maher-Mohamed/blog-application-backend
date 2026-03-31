const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
} = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
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

  const verificationToken = new VerificationToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  await verificationToken.save();
  const link = `${process.env.CLIENT_DOMAIN}/users/${user._id}/verify/${verificationToken.token}`;

  const htmlTemplate = `
<div>
  <h1>Verify Your Email</h1>
  <p>Click the link below to verify your email:</p>
  <a href="${link}">Verify Email</a>
</div>
`;
  await sendEmail({
    userEmail: user.email,
    subject: "Verify Your Email",
    htmlTemplate: htmlTemplate,
  });
  res
    .status(201)
    .json({ message: "User created successfully, please verify your email" });
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
  if (!user.isAccountVerified) {
    let verificationToken = await VerificationToken.findOne({
      userId: user._id,
    });
    if (verificationToken) {
      verificationToken = new VerificationToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await verificationToken.save();

      const link = `${process.env.CLIENT_DOMAIN}/users/${user._id}/verify/${verificationToken.token}`;

      const htmlTemplate = `
<div>
  <h1>Verify Your Email</h1>
  <p>Click the link below to verify your email:</p>
  <a href="${link}">Verify Email</a>
</div>
`;
      await sendEmail({
        userEmail: user.email,
        subject: "Verify Your Email",
        htmlTemplate: htmlTemplate,
      });
    }
    return res.status(400).json({ message: "please verify your email" });
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
    username: user.username,
    email: user.email,
    bio: user.bio,
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
  })
    .select("-password")
    .populate("posts");

  res.status(200).json(updatedUser);
});

module.exports.verifyUserAccountCtrl = asyncHandler(async (req, res) => {
  console.log("PARAMS:", req.params);

  const user = await User.findById(req.params.userId);
  console.log("USER:", user);

  const verificationToken = await VerificationToken.findOne({
    userId: req.params.userId,
    token: req.params.token,
  });

  console.log("TOKEN:", verificationToken);

  if (!user) {
    return res.status(400).json({ message: "Invalid link" });
  }

  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid token" });
  }

  user.isAccountVerified = true;
  await user.save();
  await verificationToken.deleteOne();

  res.status(200).json({ message: "Your Account verified successfully" });
});
