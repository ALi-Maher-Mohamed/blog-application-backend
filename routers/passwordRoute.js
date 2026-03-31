const router = require("express").Router();
const {
  sendResetPasswordELinkCtrl,
  getResetPasswordLinkCtrl,
  resetPasswordCtrl,
} = require("../controller/passwordController");

router.post("/reset-password-link", sendResetPasswordELinkCtrl);
router
  .route("/reset-password/:userId/:token")
  .get(getResetPasswordLinkCtrl)
  .post(resetPasswordCtrl);

module.exports = router;
