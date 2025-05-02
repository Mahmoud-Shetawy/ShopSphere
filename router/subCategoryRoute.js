const express = require("express");
const {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    updataSubCategory,
    deleteSubCategory,
    setCategoryIdToBody,
    createFilterObj,
} = require("../services/subcategoryService");
const {
    getSubCategoryValidator,
    createSubCategoryValidator,
    updataSubCategoryValidator,
    deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const {protect, allowedTo} = require("../services/authService");

const router = express.Router({mergeParams: true});

router
    .route("/")
    .get(createFilterObj, getSubCategories)
    .post(
        protect,
        allowedTo("admin", "manager"),
        setCategoryIdToBody,
        createSubCategoryValidator,
        createSubCategory
    );

router
    .route("/:id")
    .get(getSubCategoryValidator, getSubCategory)
    .put(
        protect,
        allowedTo("admin", "manager"),
        updataSubCategoryValidator,
        updataSubCategory
    )
    .delete(
        protect,
        allowedTo("admin"),
        deleteSubCategoryValidator,
        deleteSubCategory
    );
module.exports = router;
