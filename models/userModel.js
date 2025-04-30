const mongoose = require("mongoose");

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
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("User", userSchema);
