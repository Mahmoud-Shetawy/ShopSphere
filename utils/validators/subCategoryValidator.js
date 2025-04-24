const {check} = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

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
        .withMessage("Too Long Subcategory name"),

    check("category")
        .notEmpty()
        .withMessage("SubCategory must be belong to category")
        .isMongoId()
        .withMessage("Invalid category id format"),
    validatorMiddleware,
];
exports.updataSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid Subcategory id format"),
    validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid Subcategory id format"),
    validatorMiddleware,
];
