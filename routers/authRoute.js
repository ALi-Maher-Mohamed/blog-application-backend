const router = require("express").Router();
const {
  registerUserctrl,
  loginUserctrl,
} = require("../controller/authController");

//  /api/auth/register
router.post("/register", registerUserctrl);
router.post("/login", loginUserctrl);
module.exports = router;
