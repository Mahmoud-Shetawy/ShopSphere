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
const {protect, allowedTo} = require("../services/authService");

const router = express.Router();

router
    .route("/")
    .get(getBrands)
    .post(
        protect,
        allowedTo("admin", "manager"),
        getBrandImage,
        resizeImage,
        createBrandValidator,
        createBrand
    );
router
    .route("/:id")
    .get(getBrandValidator, getBrand)
    .put(
        protect,
        allowedTo("admin", "manager"),
        getBrandImage,
        resizeImage,
        updataBrandValidator,
        updataBrand
    )
    .delete(protect, allowedTo("admin"), deleteBrandValidator, deleteBrand);

module.exports = router;
