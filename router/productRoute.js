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

const router = express.Router();

router
    .route("/")
    .get(getProducts)
    .post(
        uploadProductImages,
        resizeProductImages,
        createProductValidator,
        createProduct
    );
router
    .route("/:id")
    .get(getProductValidator, getProduct)
    .put(
        uploadProductImages,
        resizeProductImages,
        updataProductValidator,
        updataProduct
    )
    .delete(deleteProductValidator, deleteProduct);
module.exports = router;
