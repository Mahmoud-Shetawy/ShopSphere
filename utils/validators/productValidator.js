const {check, body} = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Category = require("../../models/categoryModel");
const Product = require("../../models/productModel");
const subCategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
    check("title")
        .isLength({min: 3})
        .withMessage("must be at lest 3 chars")
        .notEmpty()
        .withMessage("product required")
        .custom(async (title) => {
            const results = await Product.find({slug: slugify(title)});
            if (results.length > 0) {
                throw new Error("title already in use ");
            }
        })
        .custom((value, {req}) => {
            req.body.slug = slugify(value);
            return true;
        }),
    check("description")
        .isLength({max: 2000})
        .withMessage("Too Long description")
        .notEmpty()
        .withMessage("description required"),
    check("quantity")
        .notEmpty()
        .withMessage("Product quantity required")
        .isNumeric()
        .withMessage("Product quantity must be a number"),
    check("sold")
        .optional()
        .isNumeric()
        .withMessage("Product quantity must be a number"),
    check("price")
        .notEmpty()
        .withMessage("Product price required")
        .isNumeric()
        .withMessage("Product price must be a number")
        .isLength({max: 32})
        .withMessage("Too Long price"),
    check("priceAfterDiscount")
        .optional()
        .isNumeric()
        .withMessage("Product priceAfterDiscount must be a number")
        .toFloat()
        .custom((value, {req}) => {
            if (req.body.price <= value) {
                throw new Error(
                    "Product priceAfterDiscount must be Lower than Price"
                );
            }
            return true;
        }),
    check("colors")
        .optional()
        .isArray()
        .withMessage("colors must be array of String"),
    check("imageCover")
        .notEmpty()
        .withMessage("Product imageCover is Required"),
    check("images")
        .optional()
        .isArray()
        .withMessage("Images must be array of String"),
    check("category")
        .notEmpty()
        .withMessage("Product must be belong to category")
        .isMongoId()
        .withMessage("invalid Id formate")
        .custom((categoryId) =>
            Category.findById(categoryId).then((category) => {
                if (!category) {
                    return Promise.reject(
                        new Error(`No category for this id :${categoryId}`)
                    );
                }
            })
        ),
    check("subCategories")
        .optional()
        .isMongoId()
        .withMessage("invalid Id formate")
        .custom(async (subcategories) => {
            const results = await subCategory.find({
                _id: {$in: subcategories},
            });
            const uniqueSubcategories = [
                ...new Set(subcategories.map((id) => id.toString())),
            ];
            if (uniqueSubcategories.length !== subcategories.length) {
                throw new Error("Duplicate subcategory IDs are not allowed.");
            }
            if (results.length < 1 || results.length !== subcategories.length) {
                throw new Error("invalid subCategories Id.");
            }
        })
        .custom(async (subcategories, {req}) => {
            const result = await subCategory.find({
                _id: {$in: subcategories},
                category: req.body.category,
            });
            if (result.length !== subcategories.length) {
                const foundIds = result.map((subcategory) =>
                    subcategory._id.toString()
                );
                const missingIds = subcategories.filter(
                    (id) => !foundIds.includes(id.toString())
                );
                throw new Error(
                    `Some sub-categories do not belong to the specified category: ${missingIds.join(", ")}`
                );
            }
        }),
    check("brand").optional().isMongoId().withMessage("invalid Id formate"),
    check("ratingsAverage")
        .optional()
        .isNumeric()
        .withMessage("ratingsAverage must be a number")
        .isLength({min: 1})
        .withMessage("Rating must be above or equal 1.0")
        .isLength({max: 5})
        .withMessage("Rating must be below or equal 5.0"),
    check("ratingsQuantity")
        .optional()
        .isNumeric()
        .withMessage("ratingsAverage must be a number"),
    validatorMiddleware,
];

exports.getProductValidator = [
    check("id").isMongoId().withMessage("invalid Id formate"),
    validatorMiddleware,
];
exports.updataProductValidator = [
    check("id").isMongoId().withMessage("invalid Id formate"),
    check("title")
        .optional()
        .custom((value, {req}) => {
            req.body.slug = slugify(value);
            return true;
        }),
    validatorMiddleware,
];
exports.deleteProductValidator = [
    check("id").isMongoId().withMessage("invalid Id formate"),
    validatorMiddleware,
];
