const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const {
  User,

  validateEmail,
  validateNewPassword,
} = require("../models/User");
const VerificationToken = require("../models/VerificationToken");

const { getResetPasswordEmailHTML } = require("./reset-password-template");

module.exports.sendResetPasswordELinkCtrl = asyncHandler(async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "User with this email is not found" });
  }

  let verificationToken = await VerificationToken.findOne({ userId: user._id });
  if (!verificationToken) {
    verificationToken = new VerificationToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    await verificationToken.save();
  }

  const link = `${process.env.CLIENT_DOMAIN}/reset-password/${user._id}/${verificationToken.token}`;
  const htmlTemplate = getResetPasswordEmailHTML(link, user.username);

  await sendEmail({
    userEmail: user.email,
    subject: "Reset Password",
    htmlTemplate,
  });

  res.status(200).json({
    message: "Reset password email was sent, please check your email",
  });
});

module.exports.getResetPasswordLinkCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "invalid link 1" });
  }
  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!verificationToken) {
    return res.status(400).json({ message: "Verification token not found" });
  }

  res.status(200).json({ message: "Password reset successfully" });
});

module.exports.resetPasswordCtrl = asyncHandler(async (req, res) => {
  const { error } = validateNewPassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "invalid link 2" });
  }

  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!verificationToken) {
    return res.status(400).json({ message: "Verification token not found" });
  }
  if (!user.isAccountVerified) {
    user.isAccountVerified = true;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPassword;
  await user.save();
  await verificationToken.deleteOne();
  res
    .status(200)
    .json({ message: "Password reset successfully , please login" });
});
