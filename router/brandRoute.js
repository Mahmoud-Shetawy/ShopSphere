const express = require("express");
const {
    getBrandValidator,
    createBrandValidator,
    updataBrandValidator,
    deleteBrandValidator,
} = require("../utils/validators/brandValidator");
const {
    createBrand,
    getBrand,
    getBrands,
    updataBrand,
    deleteBrand,
    getBrandImage,
    resizeImage,
} = require("../services/brandService");

// const subCategoriesRoute = require("./subCategoryRoute");

const router = express.Router();

// router.use("/:categoryId/subcategories", subCategoriesRoute);
router
    .route("/")
    .get(getBrands)
    .post(getBrandImage, resizeImage, createBrandValidator, createBrand);
router
    .route("/:id")
    .get(getBrandValidator, getBrand)
    .put(getBrandImage, resizeImage, updataBrandValidator, updataBrand)
    .delete(deleteBrandValidator, deleteBrand);
module.exports = router;
