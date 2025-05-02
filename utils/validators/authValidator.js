const {check} = require("express-validator");

const slugify = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const User = require("../../models/userModel");

exports.signupValidator = [
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
        }),

    check("email")
        .notEmpty()
        .withMessage("User Email require")
        .isEmail()
        .withMessage("Invalid email address")
        .custom(async (email) => {
            const results = await User.find({email});
            if (results.length > 0) {
                throw new Error("Email of user already in use!");
            }
        }),

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

    validatorMiddleware,
];

exports.loginValidator = [
    check("email")
        .notEmpty()
        .withMessage("User Email require")
        .isEmail()
        .withMessage("Invalid email address"),
    check("password").notEmpty().withMessage("Password require"),

    validatorMiddleware,
];
