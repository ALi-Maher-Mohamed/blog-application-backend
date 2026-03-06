const {
  getAllUsersctrl,
  getUserProfilectrl,
  getUsersCountctrl,
  profilePhotoUploadCtrl,
  deleteUserProfilectrl,
} = require("../controller/userController");
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyToken,
  verifyTokenAndAuthrization,
} = require("../Middlewares/verifyToken");
const validateObjectId = require("../Middlewares/validateObjectId");
const { updateUserProfilectrl } = require("../controller/authController");
const photoUpload = require("../Middlewares/photoUpload");
const router = require("express").Router();

router.route("/profile").get(verifyTokenAndAdmin, getAllUsersctrl);
router
  .route("/profile/:id")
  .delete(validateObjectId, verifyTokenAndAuthrization, deleteUserProfilectrl)
  .get(validateObjectId, getUserProfilectrl)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfilectrl);
// api/users/profile/profile-photo-upload
router
  .route("/profile/profile-photo-upload")
  .post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl);

router.route("/count").get(verifyTokenAndAdmin, getUsersCountctrl);
module.exports = router;
