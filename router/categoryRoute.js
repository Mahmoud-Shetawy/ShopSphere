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
    getCategoryImage,
    resizeImage,
} = require("../services/categoryService");

const {protect, allowedTo} = require("../services/authService");

const subCategoriesRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoriesRoute);
router
    .route("/")
    .get(getCategories)
    .post(
        protect,
        allowedTo("admin", "manager"),
        getCategoryImage,
        resizeImage,
        createCategoryValidator,
        createCategory
    );
router
    .route("/:id")
    .get(getCategoryValidator, getCategory)
    .put(
        protect,
        allowedTo("admin", "manager"),
        getCategoryImage,
        resizeImage,
        updataCategoryValidator,
        updataCategory
    )
    .delete(
        protect,
        allowedTo("admin"),
        deleteCategoryValidator,
        deleteCategory
    );
module.exports = router;
