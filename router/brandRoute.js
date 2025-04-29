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

const router = express.Router();

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
