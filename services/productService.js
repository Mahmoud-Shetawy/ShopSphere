const slugify = require("slugify");
const qs = require("qs");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");

// @desc    Get List of Product
// @route   GET  /api/v1/Products
// access   public
exports.getProducts = asyncHandler(async (req, res) => {
    const queryObj = qs.parse(req.query);

    const excludesFields = ["page", "sort", "limit", "fields"];
    excludesFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // const mongoQueryObj = JSON.parse(queryStr);

    //------------------------------------------------------------------------------------------------
    //!----------------------------------Implement pagination-----------------------------------------------
    //------------------------------------------------------------------------------------------------
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    let mongooseQuery = Product.find(JSON.parse(queryStr))
        .skip(skip)
        .limit(limit)
        .populate({
            path: "category",
            select: "name -_id",
        });
    //------------------------------------------------------------------------------------------------
    //!----------------------------------Implement Sort-----------------------------------------------
    //------------------------------------------------------------------------------------------------
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
        mongooseQuery = mongooseQuery.sort("-createAt");
    }

    //------------------------------------------------------------------------------------------------
    //!----------------------------------fields limiting-----------------------------------------------
    //------------------------------------------------------------------------------------------------

    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        mongooseQuery = mongooseQuery.select(fields);
    } else {
        mongooseQuery = mongooseQuery.select("-__v");
    }
    //------------------------------------------------------------------------------------------------
    //!----------------------------------Search -----------------------------------------------
    //------------------------------------------------------------------------------------------------

    if (req.query.keyword) {
        const query = {};
        query.$or = [
            {title: {$regex: req.query.keyword, $options: "i"}},
            {description: {$regex: req.query.keyword, $options: "i"}},
        ];

        console.dir(query, {depth: null});
        mongooseQuery = mongooseQuery.find(query);
        const results = await mongooseQuery.exec();
        console.log("Results:", results);
    }

    //------------------------------------------------------------------------------------------------
    //!----------------------------------execute Query-----------------------------------------------
    //------------------------------------------------------------------------------------------------

    const products = await mongooseQuery;

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
