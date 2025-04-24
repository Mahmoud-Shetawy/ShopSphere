const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const ApiError = require("../utils/apiError");
// @desc    Get List of Brands
// @route   GET  /api/v1/Brands
// access   public
exports.getBrands = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const brands = await Brand.find({}).skip(skip).limit(limit);

    res.status(200).json({results: brands.length, page, data: brands});
});

// @desc    get specific  Brand
// @route   GET  /api/v1/Brand/:id
// access  public
exports.getBrand = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const brand = await Brand.findById(id);
    if (!brand) {
        return next(new ApiError(`No brand For this id ${id}`, 404));
    }
    res.status(200).json({
        data: brand,
    });
});

// @desc    Create Brand
// @route   POST  /api/v1/Brand
// access  Private
exports.createBrand = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const brand = await Brand.create({
        name,
        slug: slugify(name),
    });
    res.status(201).json({data: brand});
});

// @desc     Updata specific  Brand
// @route   PUT  /api/v1/brand/:id
// access  Private
exports.updataBrand = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const {name} = req.body;

    const brand = await Brand.findOneAndUpdate(
        {_id: id},
        {name, slug: slugify(name)},
        {new: true}
    );
    if (!brand) {
        return next(new ApiError(`No brand For this id ${id}`, 404));
    }
    res.status(200).json({
        data: brand,
    });
});

// @desc     Delete specific  Brand
// @route   DELETE  /api/v1/brand/:id
// access  Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const brand = await Brand.findByIdAndDelete({_id: id}, {new: true});
    if (!brand) {
        return next(new ApiError(`No Brand For this id ${id}`, 404));
    }
    res.status(204).send();
});
