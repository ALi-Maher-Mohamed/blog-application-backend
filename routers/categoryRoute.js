const router = require("express").Router();

const {
  createCategoryCtrl,
  deleteCategoryCtrl,
  getAllCategoriesCtrl,
} = require("../controller/categoryControllers");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../Middlewares/verifyToken");
const validateObjectId = require("../Middlewares/validateObjectId");

router
  .route("/")
  .post(verifyToken, createCategoryCtrl)
  .get(getAllCategoriesCtrl);

router
  .route("/:id")
  .delete(validateObjectId, verifyTokenAndAdmin, deleteCategoryCtrl);
//   .put(verifyToken, createCategoryCtrl);
module.exports = router;
