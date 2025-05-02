const {check, body} = require("express-validator");

const slugify = require("slugify");
const bcrypt = require("bcryptjs");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const User = require("../../models/userModel");

exports.createUserValidator = [
    check("name")
        .notEmpty()
        .withMessage("User Name require")
        .isLength({min: 3})
        .withMessage("Too Short User name")
        .custom(async (name) => {
            const results = await User.find({slug: slugify(name)});
            if (results.length > 0) {
                throw new Error("name of User already in use!");
            }
        })
        .custom((value, {req}) => {
            req.body.slug = slugify(value);
            return true;
        }),
    check("email")
        .notEmpty()
        .withMessage("User Email require")
        .isEmail()
        .withMessage("Invalid email address"),
    // .custom(async (email) => {
    //     const results = await User.findOne({slug: slugify(email)});
    //     if (results.length > 0) {
    //         throw new Error("Email of user already in use!");
    //     }
    // }),
    check("password")
        .notEmpty()
        .withMessage("Password require")
        .isLength({min: 8})
        .withMessage("Password must be at least 8 characters")
        .custom((password, {req}) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error("password Confirm no't correct");
            }
            return true;
        }),

    check("passwordConfirm").notEmpty().withMessage("Password Confirm require"),

    check("phone")
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage(
            "Invalid phone number only accepted EG and SA phone number"
        )
        .optional(),

    check("profileImg").optional(),
    check("role").optional(),
    validatorMiddleware,
];

exports.getUserValidator = [
    check("id").isMongoId().withMessage("Invalid User id format"),

    validatorMiddleware,
];

exports.updateUserValidator = [
    check("id").isMongoId().withMessage("Invalid User id format"),
    body("name")
        .optional()
        .custom(async (name) => {
            const results = await User.find({slug: slugify(name)});
            if (results.length > 0) {
                throw new Error("name of User already in use!");
            }
        })
        .custom((value, {req}) => {
            req.body.slug = slugify(value);
            return true;
        }),
    check("email")
        .notEmpty()
        .withMessage("User Email require")
        .isEmail()
        .withMessage("Invalid email address")
        .custom(async (email) => {
            const results = await User.findOne({slug: slugify(email)});
            if (results.length > 0) {
                throw new Error("Email of user already in use!");
            }
        }),
    check("phone")
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage(
            "Invalid phone number only accepted EG and SA phone number"
        )
        .optional(),

    check("profileImg").optional(),
    check("role").optional(),
    validatorMiddleware,
];
exports.changeUserPasswordValidator = [
    check("id").isMongoId().withMessage("Invalid User id format"),
    check("currentPassword")
        .notEmpty()
        .withMessage("You must enter your current password"),
    body("passwordConfirm")
        .notEmpty()
        .withMessage("You must enter password confirm"),
    body("password")
        .notEmpty()
        .withMessage("You must enter new password")
        .custom(async (newPassword, {req}) => {
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error("There no't user for this Id", 404);
            }
            const correctCurrentPassword = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );
            if (!correctCurrentPassword) {
                throw new Error("Incorrect Current Password");
            }
            if (newPassword !== req.body.passwordConfirm) {
                throw new Error("password Confirm incorrect");
            }
            return true;
        }),

    validatorMiddleware,
];
exports.deleteUserValidator = [
    check("id").isMongoId().withMessage("Invalid User id format"),
    validatorMiddleware,
];
