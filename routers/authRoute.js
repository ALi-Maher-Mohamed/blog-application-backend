const router = require("express").Router();
const { registerUserctrl } = require("../controller/authController");

//  /api/auth/register
router.post("/register", registerUserctrl);
module.exports = router;
