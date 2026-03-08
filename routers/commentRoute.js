const router = require("express").Router();
const { verifyToken } = require("../Middlewares/verifyToken");
const validateObjectId = require("../Middlewares/validateObjectId");
const {
  createCommentCtrl,
  getAllCommentsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../controller/commentController");

router
  .route("/")
  .post(verifyToken, createCommentCtrl)
  .get(verifyToken, getAllCommentsCtrl);

router
  .route("/:id")
  .delete(validateObjectId, verifyToken, deleteCommentCtrl)
  .put(validateObjectId, verifyToken, updateCommentCtrl);
module.exports = router;
