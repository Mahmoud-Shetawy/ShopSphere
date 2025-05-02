const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Name is required"],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is Required"],
            lowercase: true,
        },
        phone: String,
        profileImg: String,
        password: {
            type: String,
            require: [true, "Password is Required"],
            minlength: [8, "Too Short Password"],
        },
        passwordChangeAt: Date,
        passwordResetCode: String,
        passwordResetExpires: Date,
        passwordResetVerified: Boolean,
        role: {
            type: String,
            enum: ["user", "manager", "admin"],
            default: "user",
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {timestamps: true}
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model("User", userSchema);
