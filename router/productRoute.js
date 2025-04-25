const express = require("express");

const {
    getProducts,
    createProduct,
    getProduct,
    updataProduct,
    deleteProduct,
} = require("../services/productService");
const {
    createProductValidator,
    getProductValidator,
    updataProductValidator,
    deleteProductValidator,
} = require("../utils/validators/productValidator");

const router = express.Router();

router.route("/").get(getProducts).post(createProductValidator, createProduct);
router
    .route("/:id")
    .get(getProductValidator, getProduct)
    .put(updataProductValidator, updataProduct)
    .delete(deleteProductValidator, deleteProduct);
module.exports = router;
