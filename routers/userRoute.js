const {
  getAllUsersctrl,
  getUserProfilectrl,
  getUsersCountctrl,
} = require("../controller/userController");
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
} = require("../Middlewares/verifyToken");
const validateObjectId = require("../Middlewares/validateObjectId");
const { updateUserProfilectrl } = require("../controller/authController");
const router = require("express").Router();

router.route("/profile").get(verifyTokenAndAdmin, getAllUsersctrl);
router
  .route("/profile/:id")
  .get(validateObjectId, getUserProfilectrl)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfilectrl);

router.route("/count").get(verifyTokenAndAdmin, getUsersCountctrl);
module.exports = router;
