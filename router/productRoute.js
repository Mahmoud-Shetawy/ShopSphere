const express = require("express");

const {
    getProducts,
    createProduct,
    getProduct,
    updataProduct,
    deleteProduct,
    resizeProductImages,
    uploadProductImages,
} = require("../services/productService");
const {
    createProductValidator,
    getProductValidator,
    updataProductValidator,
    deleteProductValidator,
} = require("../utils/validators/productValidator");
const {protect, allowedTo} = require("../services/authService");

const router = express.Router();

router
    .route("/")
    .get(getProducts)
    .post(
        protect,
        allowedTo("admin", "manager"),
        uploadProductImages,
        resizeProductImages,
        createProductValidator,
        createProduct
    );
router
    .route("/:id")
    .get(getProductValidator, getProduct)
    .put(
        protect,
        allowedTo("admin", "manager"),
        uploadProductImages,
        resizeProductImages,
        updataProductValidator,
        updataProduct
    )
    .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);
module.exports = router;
