const router = require("express").Router();
const { verify } = require("jsonwebtoken");
const {
  registerUserctrl,
  loginUserctrl,
  verifyUserAccountCtrl,
} = require("../controller/authController");

//  /api/auth/register
router.post("/register", registerUserctrl);
// /api/auth/login
router.post("/login", loginUserctrl);
// /api/auth/:userId/verify/:token
router.get("/:userId/verify/:token", verifyUserAccountCtrl);
module.exports = router;
