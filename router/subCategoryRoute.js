const express = require("express");
const {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    updataSubCategory,
    deleteSubCategory,
    setCategoryIdToBady,
    createFilterObj,
} = require("../services/subcategoryService");
const {
    getSubCategoryValidator,
    createSubCategoryValidator,
    updataSubCategoryValidator,
    deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const router = express.Router({mergeParams: true});

router
    .route("/")
    .get(createFilterObj, getSubCategories)
    .post(setCategoryIdToBady, createSubCategoryValidator, createSubCategory);

router
    .route("/:id")
    .get(getSubCategoryValidator, getSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory)
    .put(updataSubCategoryValidator, updataSubCategory);
module.exports = router;
