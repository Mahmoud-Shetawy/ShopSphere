const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
// @desc    Get List of Categories
// @route   GET  /api/v1/Categories
// access   public
exports.getCategories = factory.getAll(Category);

// @desc    get specific  Category
// @route   GET  /api/v1/Categories/:id
// access  public
exports.getCategory = factory.getOne(Category);

// @desc    Create Category
// @route   POST  /api/v1/Category
// access  Private
exports.createCategory = factory.createOne(Category);

// @desc     Updata specific  Category
// @route   PUT  /api/v1/Categories/:id
// access  Private
exports.updataCategory = factory.updateOne(Category);

// @desc     Delete specific  Category
// @route   DELETE  /api/v1/Categories/:id
// access  Private
exports.deleteCategory = factory.deleteOne(Category);
