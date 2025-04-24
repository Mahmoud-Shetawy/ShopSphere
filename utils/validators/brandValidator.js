const {check} = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand id format"),
    validatorMiddleware,
];

exports.createBrandValidator = [
    check("name")
        .notEmpty()
        .withMessage("Brand Name require")
        .isLength({min: 3})
        .withMessage("Too Short Brand name")
        .isLength({max: 32})
        .withMessage("Too Long Brand name"),
    validatorMiddleware,
];
exports.updataBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand id format"),
    validatorMiddleware,
];
exports.deleteBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand id format"),
    validatorMiddleware,
];
