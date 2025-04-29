const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
// @desc    Get List of Brands
// @route   GET  /api/v1/Brands
// access   public
exports.getBrands = factory.getAll(Brand);

// @desc    get specific  Brand
// @route   GET  /api/v1/Brand/:id
// access  public
exports.getBrand = factory.getOne(Brand);

// @desc    Create Brand
// @route   POST  /api/v1/Brand
// access  Private
exports.createBrand = factory.createOne(Brand);

// @desc     Updata specific  Brand
// @route   PUT  /api/v1/brand/:id
// access  Private
exports.updataBrand = factory.updateOne(Brand);

// @desc     Delete specific  Brand
// @route   DELETE  /api/v1/brand/:id
// access  Private
exports.deleteBrand = factory.deleteOne(Brand);
