const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
// @desc    Get List of Product
// @route   GET  /api/v1/Products
// access   public
exports.getProducts = factory.getAll(Product);

// @desc    get specific  Product
// @route   GET  /api/v1/Products/:id
// access  public
exports.getProduct = factory.getOne(Product);
// @desc    Create Product
// @route   POST  /api/v1/products
// access  Private
exports.createProduct = factory.createOne(Product);

// @desc     Updata specific  Product
// @route   PUT  /api/v1/Products/:id
// access  Private
exports.updataProduct = factory.updateOne(Product);

// @desc     Delete specific  product
// @route   DELETE  /api/v1/products/:id
// access  Private
exports.deleteProduct = factory.deleteOne(Product);
