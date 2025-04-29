const multer = require("multer");
const {v4: uuidv4} = require("uuid");
const sharp = require("sharp");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const factory = require("./handlersFactory");

const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else cb(new ApiError("Only images allow upload ", 400), false);
};
const multerStorage = multer.memoryStorage();
const upload = multer({storage: multerStorage, fileFilter: multerFilter});

exports.uploadProductImages = upload.fields([
    {name: "imageCover", maxCount: 1},
    {name: "images", maxCount: 5},
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
    if (req.files.imageCover) {
        const imageProductFileName = `Product-${uuidv4()}-${Date.now()}-Cover.jpeg`;

        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({quality: 90})
            .toFile(`uploads/products/${imageProductFileName}`);
        req.body.imageCover = imageProductFileName;
    }
    if (req.files.images) {
        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (img, index) => {
                const imageName = `Product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat("jpeg")
                    .jpeg({quality: 90})
                    .toFile(`uploads/products/${imageName}`);
                req.body.images.push(imageName);
            })
        );
        next();
    }
});
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
