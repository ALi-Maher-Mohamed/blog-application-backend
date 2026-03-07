const router = require("express").Router();

const {
  createPostctrl,
  updatePostImageCtrl: updatePostctrl,
  getAllPostsctrl,
  getSingelPostctrl,
  getPostCountctrl,
  deletePostctrl,
  updatePostImageCtrl,
} = require("../controller/postrController");

const validateObjectId = require("../Middlewares/validateObjectId");
const photoUpload = require("../Middlewares/photoUpload");
const { verifyToken } = require("../Middlewares/verifyToken");

router
  .route("/")
  .post(verifyToken, photoUpload.single("image"), createPostctrl)
  .get(getAllPostsctrl);

router.route("/count").get(getPostCountctrl);
router
  .route("/:id")
  .get(validateObjectId, getSingelPostctrl)
  .delete(validateObjectId, verifyToken, deletePostctrl)
  .put(validateObjectId, verifyToken, updatePostctrl);

router
  .route("/update-image/:id")
  .put(
    validateObjectId,
    verifyToken,
    photoUpload.single("image"),
    updatePostImageCtrl,
  );
module.exports = router;
