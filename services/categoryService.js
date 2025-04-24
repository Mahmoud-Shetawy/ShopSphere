const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
// @desc    Get List of Categories
// @route   GET  /api/v1/Categories
// access   public
exports.getCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const categories = await Category.find({}).skip(skip).limit(limit);

    res.status(200).json({results: categories.length, page, data: categories});
});

// @desc    get specific  Category
// @route   GET  /api/v1/Categories/:id
// access  public
exports.getCategory = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const categories = await Category.findById(id);
    if (!categories) {
        return next(new ApiError(`No category For this id ${id}`, 404));
        // res.status(404).json({mes: `No category for this id ${id}`});
    }
    res.status(200).json({
        data: categories,
    });
});

// @desc    Create Category
// @route   POST  /api/v1/Category
// access  Private
exports.createCategory = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const category = await Category.create({
        name,
        slug: slugify(name),
    });
    res.status(201).json({data: category});
});

// @desc     Updata specific  Category
// @route   PUT  /api/v1/Categories/:id
// access  Private
exports.updataCategory = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const {name} = req.body;

    const categories = await Category.findOneAndUpdate(
        {_id: id},
        {name, slug: slugify(name)},
        {new: true}
    );
    if (!categories) {
        return next(new ApiError(`No category For this id ${id}`, 404));

        // res.status(404).json({mes: `No category for this id ${id}`});
    }
    res.status(200).json({
        data: categories,
    });
});

// @desc     Delete specific  Category
// @route   DELETE  /api/v1/Categories/:id
// access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const categories = await Category.findByIdAndDelete({_id: id}, {new: true});
    if (!categories) {
        return next(new ApiError(`No category For this id ${id}`, 404));

        // res.status(404).json({mes: `No category for this id ${id}`});
    }
    res.status(204).send();
});
