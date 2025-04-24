const express = require("express");
const {
    getCategoryValidator,
    createCategoryValidator,
    updataCategoryValidator,
    deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const {
    createCategory,
    getCategories,
    getCategory,
    updataCategory,
    deleteCategory,
} = require("../services/categoryService");

const router = express.Router();

router
    .route("/")
    .get(getCategories)
    .post(createCategoryValidator, createCategory);
router
    .route("/:id")
    .get(getCategoryValidator, getCategory)
    .put(updataCategoryValidator, updataCategory)
    .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
