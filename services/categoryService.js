const multer = require("multer");
const {v4: uuidv4} = require("uuid");

const sharp = require("sharp");

const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const {uploadSingleImage} = require("../middleware/uploadImageMiddleware");

exports.getCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
    // const ext = req.file.mimetype.split("/")[1];
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({quality: 90})
        .toFile(`uploads/categories/${fileName}`);
    req.body.image = fileName;
    next();
});
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
