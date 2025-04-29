const {check, body} = require("express-validator");

const slugify = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const subCategory = require("../../models/subCategoryModel");

exports.getSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid Subcategory id format"),
    validatorMiddleware,
];

exports.createSubCategoryValidator = [
    check("name")
        .notEmpty()
        .withMessage("SubCategory Name require")
        .isLength({min: 3})
        .withMessage("Too Short Subcategory name")
        .isLength({max: 32})
        .withMessage("Too Long Subcategory name")
        .custom(async (name) => {
            const results = await subCategory.find({slug: slugify(name)});
            if (results.length > 0) {
                throw new Error("name of subCategory already in use.");
            }
        })
        .custom((value, {req}) => {
            req.body.slug = slugify(value);
            return true;
        }),

    check("category")
        .notEmpty()
        .withMessage("SubCategory must be belong to category")
        .isMongoId()
        .withMessage("Invalid category id format"),
    validatorMiddleware,
];
exports.updataSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid Subcategory id format"),
    check("name").custom((value, {req}) => {
        req.body.slug = slugify(value);
        return true;
    }),
    validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid Subcategory id format"),
    validatorMiddleware,
];
