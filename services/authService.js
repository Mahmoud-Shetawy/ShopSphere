const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const crypto = require("crypto");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const CreateToken = (payload) =>
    jwt.sign({userId: payload}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });

exports.signup = asyncHandler(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        slug: slugify(req.body.name),
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
    });
    const token = CreateToken(user._id);

    res.status(201).json({data: user, token});
});

exports.login = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError("Incorrect Email or Password", 401));
    }
    const token = CreateToken(user._id);
    res.status(200).json({data: user, token});
});

exports.protect = asyncHandler(async (req, res, next) => {
    // 1) Check if token exist, if exist get

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(
            new ApiError(
                "You are Not login ,please login to get access this route",
                401
            )
        );
    }

    // 2) Verify token (no change happens, expired token)

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3) Check if user exists

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(
            new ApiError(
                "The user that belong to this token does no longer exist",
                401
            )
        );
    }
    // 4) Check if user change his password after token created

    if (currentUser.passwordChangeAt) {
        const passwordChangeTimestamp = parseInt(
            currentUser.passwordChangeAt.getTime() / 1000,
            10
        );
        // Password changed after token created (Error)
        if (passwordChangeTimestamp > decoded.iat) {
            return next(
                new ApiError(
                    "User recently changed his password ,please login again...",
                    401
                )
            );
        }
    }
    req.user = currentUser;
    next();
});

exports.allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError("You are not allowed to access this route", 403)
            );
        }
        next();
    });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return next(
            new ApiError(
                `There is no user with that email:${req.body.email}`,
                404
            )
        );
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");

    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save();

    // 3) Send the reset code via email
    const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset code (valid for 10 min)",
            message,
        });
    } catch (err) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save();
        return next(new ApiError("There is an error in sending email", 500));
    }

    res.status(200).json({
        status: "Success",
        message: "Reset code sent to email",
    });
});

exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
    const hashedResetCode = crypto
        .createHash("sha256")
        .update(req.body.resetCode)
        .digest("hex");

    const user = await User.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: {$gt: Date.now()},
    });

    if (!user) {
        return next(new ApiError("Reset code invalid or expired"));
    }

    // 2) Reset code valid
    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({
        status: "Success",
    });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return next(
            new ApiError(`There is no user with email ${req.body.email}`)
        );
    }
    if (!user.passwordResetVerified) {
        return next(new ApiError("Reset code not verified"));
    }

    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    const token = CreateToken(user._id);
    res.status(200).json({token});
});
