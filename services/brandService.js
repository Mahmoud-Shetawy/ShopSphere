const asyncHandler = require("express-async-handler");
const multer = require("multer");
const {v4: uuidv4} = require("uuid");

const sharp = require("sharp");
const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");

const {uploadSingleImage} = require("../middleware/uploadImageMiddleware");

exports.getBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
    // const ext = req.file.mimetype.split("/")[1];
    const fileName = `Brand-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({quality: 90})
        .toFile(`uploads/brands/${fileName}`);
    req.body.image = fileName;
    next();
});

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
