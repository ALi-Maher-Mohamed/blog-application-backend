const asyncHandler = require("express-async-handler");
const { Category, validateCreateCategory } = require("../models/Category");

module.exports.getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});

// create category
module.exports.createCategoryCtrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const category = await Category.create({
    title: req.body.title,
    user: req.user.id,
  });
  res.status(201).json(category);
});

// delete category
module.exports.deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.status(200).json({ message: "Category deleted successfully" });
});

// update category
module.exports.updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
      },
    },
    { new: true },
  );
  res.status(200).json(category);
});
