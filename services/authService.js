const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const slugify = require("slugify");

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
