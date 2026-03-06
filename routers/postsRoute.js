const router = require("express").Router();

const {
  createPostctrl,
  getAllPostsctrl,
  getSingelPostctrl,
  getPostCountctrl,
} = require("../controller/postrController");

const validateObjectId = require("../Middlewares/validateObjectId");
const photoUpload = require("../Middlewares/photoUpload");
const { verifyToken } = require("../Middlewares/verifyToken");

router
  .route("/")
  .post(verifyToken, photoUpload.single("image"), createPostctrl)
  .get(getAllPostsctrl);

router.route("/count").get(getPostCountctrl);
router.route("/:id").get(validateObjectId, getSingelPostctrl);
module.exports = router;
