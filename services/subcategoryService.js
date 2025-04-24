const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const subCategory = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");

/////////////////////////////////////////////////////////////////////////////////////
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) {
        filterObject = {category: req.params.categoryId};
    }
    req.filterObject = filterObject;
    next();
};
/////////////////////////////////////////////////////////////////////////////////////

// @desc    Get List of Categories
// @route   GET  /api/v1/Categories
// access   public
exports.getSubCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    const subCategories = await subCategory
        .find(req.filterObject)
        .skip(skip)
        .limit(limit)
        .populate({
            path: "category",
            select: "name -_id",
        });

    res.status(200).json({
        results: subCategories.length,
        page,
        data: subCategories,
    });
});

// @desc    get specific  subCategory
// @route   GET  /api/v1/subCategories/:id
// access  public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const subCategories = await subCategory.findById(id);
    // .populate({
    //     path: "category",
    //     select: "name -_id",
    // });
    if (!subCategories) {
        return next(new ApiError(`No subcategory For this id ${id}`, 404));
        // res.status(404).json({mes: `No subcategory for this id ${id}`});
    }
    res.status(200).json({
        data: subCategories,
    });
});

exports.setCategoryIdToBady = (req, res, next) => {
    if (!req.body.category) {
        req.body.category = req.params.categoryId;
    }
    next();
};

// @desc    Create subCategory
// @route   POST  /api/v1/subCategory
// access  Private
exports.createSubCategory = asyncHandler(async (req, res) => {
    const {name, category} = req.body;

    const subcategory = await subCategory.create({
        name,
        slug: slugify(name),
        category,
    });
    res.status(201).json({data: subcategory});
});

// @desc     Updata specific  subCategory
// @route   PUT  /api/v1/subCategories/:id
// access  Private
exports.updataSubCategory = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const {name, category} = req.body;

    const subCategories = await subCategory.findOneAndUpdate(
        {_id: id},
        {name, slug: slugify(name), category},
        {new: true}
    );
    if (!subCategories) {
        return next(new ApiError(`No subcategory For this id ${id}`, 404));

        // res.status(404).json({mes: `No subcategory for this id ${id}`});
    }
    res.status(200).json({
        data: subCategories,
    });
});

// @desc     Delete specific  subCategory
// @route   DELETE  /api/v1/subCategories/:id
// access  Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const subCategories = await subCategory.findByIdAndDelete(id);
    if (!subCategories) {
        return next(new ApiError(`No subcategory For this id ${id}`, 404));

        // res.status(404).json({mes: `No subcategory for this id ${id}`});
    }
    res.status(204).send();
});
