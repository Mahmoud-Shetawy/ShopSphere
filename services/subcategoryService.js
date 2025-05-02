const subCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) {
        filterObject = {category: req.params.categoryId};
    }
    req.filterObject = filterObject;
    next();
};

exports.setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) {
        req.body.category = req.params.categoryId;
    }
    next();
};

// @desc    Get List of Categories
// @route   GET  /api/v1/Categories
// access   public
exports.getSubCategories = factory.getAll(subCategory);

// @desc    get specific  subCategory
// @route   GET  /api/v1/subCategories/:id
// access  public
exports.getSubCategory = factory.getOne(subCategory);

// @desc    Create subCategory
// @route   POST  /api/v1/subCategory
// access  Private
exports.createSubCategory = factory.createOne(subCategory);

// @desc     Updata specific  subCategory
// @route   PUT  /api/v1/subCategories/:id
// access  Private
exports.updataSubCategory = factory.updateOne(subCategory);

// @desc     Delete specific  subCategory
// @route   DELETE  /api/v1/subCategories/:id
// access  Private
exports.deleteSubCategory = factory.deleteOne(subCategory);
