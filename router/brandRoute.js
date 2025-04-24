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
} = require("../services/brandService");

// const subCategoriesRoute = require("./subCategoryRoute");

const router = express.Router();

// router.use("/:categoryId/subcategories", subCategoriesRoute);
router.route("/").get(getBrands).post(createBrandValidator, createBrand);
router
    .route("/:id")
    .get(getBrandValidator, getBrand)
    .put(updataBrandValidator, updataBrand)
    .delete(deleteBrandValidator, deleteBrand);
module.exports = router;
