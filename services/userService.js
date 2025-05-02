const asyncHandler = require("express-async-handler");
const {v4: uuidv4} = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");

const {uploadSingleImage} = require("../middleware/uploadImageMiddleware");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const factory = require("./handlersFactory");
const CreateToken = require("../utils/createToken");

//upload single image
exports.getUserImage = uploadSingleImage("profileImg");

// image  process
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `User-${uuidv4()}-${Date.now()}.jpeg`;

    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({quality: 90})
            .toFile(`uploads/users/${fileName}`);
        req.body.profileImg = fileName;
    }
    next();
});

// @desc    Get List of Users
// @route   GET  /api/v1/User
// access   Private
exports.getUsers = factory.getAll(User);

// @desc    get specific  User
// @route   GET  /api/v1/User/:id
// access  Private
exports.getUser = factory.getOne(User);

// @desc    Create User
// @route   POST  /api/v1/User
// access  Private
exports.createUser = factory.createOne(User);

// @desc     Updata specific  User
// @route   PUT  /api/v1/User/:id
// access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const documents = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            slug: slugify(req.body.name),
            role: req.body.role,
            phone: req.body.phone,
            profileImg: req.body.profileImg,
        },
        {
            new: true,
        }
    );
    if (!documents) {
        return next(
            new ApiError(
                `No ${User.modelName} For this id ${req.params.id}`,
                404
            )
        );
    }
    res.status(200).json({
        data: documents,
    });
});
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const documents = await User.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangeAt: Date.now(),
        },
        {
            new: true,
        }
    );

    if (!documents) {
        return next(
            new ApiError(
                `No ${User.modelName} For this id ${req.params.id}`,
                404
            )
        );
    }
    res.status(200).json({
        data: documents,
    });
});
// @desc     Delete specific  User
// @route   DELETE  /api/v1/User/:id
// access  Private
exports.deleteUser = factory.deleteOne(User);

// @desc     Get logger User
// @route   DELETE  /api/v1/User/getMe
// access  Private
exports.getLoggedUserDate = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

// @desc     Update logger User
// @route   DELETE  /api/v1/User/updateMyPassword
// access  Private
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangeAt: Date.now(),
        },
        {
            new: true,
        }
    );
    const token = CreateToken(user._id);
    res.status(200).json({data: user, token});
});

// @desc     Update logger User
// @route   DELETE  /api/v1/User/updateMyPassword
// access  Private
exports.updateLoggedUserDate = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            slug: slugify(req.body.name),
            phone: req.body.phone,
        },
        {
            new: true,
        }
    );
    res.status(200).json({data: user});
});

// @desc     delete logger User
// @route   DELETE  /api/v1/User/deleteMe
// access  Private
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            active: false,
        },
        {
            new: true,
        }
    );
    res.status(204).json({status: "Success"});
});
