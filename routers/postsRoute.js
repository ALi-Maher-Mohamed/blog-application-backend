const router = require("express").Router();

const {
  createPostctrl,
  updatePostCtrl,
  getAllPostsctrl,
  getSingelPostctrl,
  getPostCountctrl,
  deletePostctrl,
  updatePostImageCtrl,
  toggleLikeCtrl,
  aiSummarizeCtrl,
  aiWritePostCtrl,
} = require("../controller/postsController");

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
  .put(validateObjectId, verifyToken, updatePostCtrl);

router
  .route("/update-image/:id")
  .put(
    validateObjectId,
    verifyToken,
    photoUpload.single("image"),
    updatePostImageCtrl,
  );
router.post("/ai-write", verifyToken, aiWritePostCtrl);

// Route لتلخيص المقال
router.post("/ai-summarize", verifyToken, aiSummarizeCtrl);
router.route("/like/:id").put(validateObjectId, verifyToken, toggleLikeCtrl);
module.exports = router;
