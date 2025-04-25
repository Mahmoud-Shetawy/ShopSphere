const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");

// @desc    Get List of Product
// @route   GET  /api/v1/Products
// access   public
exports.getProducts = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const products = await Product.find({}).skip(skip).limit(limit);

    res.status(200).json({results: products.length, page, data: products});
});

// @desc    get specific  Product
// @route   GET  /api/v1/Products/:id
// access  public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const product = await Product.findById(id);
    if (!product) {
        return next(new ApiError(`No product For this id ${id}`, 404));
    }
    res.status(200).json({
        data: product,
    });
});

// @desc    Create Product
// @route   POST  /api/v1/products
// access  Private
exports.createProduct = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.title);
    const product = await Product.create(req.body);
    res.status(201).json({data: product});
});

// @desc     Updata specific  Product
// @route   PUT  /api/v1/Products/:id
// access  Private
exports.updataProduct = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    req.body.title = slugify(req.body.title);

    const product = await Product.findOneAndUpdate({_id: id}, req.body, {
        new: true,
    });
    if (!product) {
        return next(new ApiError(`No product For this id ${id}`, 404));
    }
    res.status(200).json({
        data: product,
    });
});

// @desc     Delete specific  product
// @route   DELETE  /api/v1/products/:id
// access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        return next(new ApiError(`No product For this id ${id}`, 404));
    }
    res.status(204).send();
});
