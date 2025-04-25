const {check} = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Category = require("../../models/categoryModel");

exports.getCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid category id format"),
    validatorMiddleware,
];

exports.createCategoryValidator = [
    check("name")
        .notEmpty()
        .withMessage("Category Name require")
        .isLength({min: 3})
        .withMessage("Too Short category name")
        .isLength({max: 32})
        .withMessage("Too Long category name")
        .custom(async (name) => {
            const results = await Category.find({slug: slugify(name)});
            if (results.length > 0) {
                throw new Error("name of Category already in use.");
            }
        }),
    validatorMiddleware,
];
exports.updataCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid category id format"),
    validatorMiddleware,
];
exports.deleteCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid category id format"),
    validatorMiddleware,
];
