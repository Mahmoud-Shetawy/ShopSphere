const {check, body} = require("express-validator");

const slugify = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Brand = require("../../models/brandModel");

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
        .withMessage("Too Long Brand name")
        .custom(async (name) => {
            const results = await Brand.find({slug: slugify(name)});
            if (results.length > 0) {
                throw new Error("name of Brand already in use!");
            }
        })
        .custom((value, {req}) => {
            req.body.slug = slugify(value);
            return true;
        }),
    validatorMiddleware,
];
exports.updataBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand id format"),
    body("name").custom((value, {req}) => {
        req.body.slug = slugify(value);
        return true;
    }),
    validatorMiddleware,
];
exports.deleteBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand id format"),
    validatorMiddleware,
];
