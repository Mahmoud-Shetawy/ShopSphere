const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "category required"],
            unique: [true, "category must be unique"],
            minlength: [3, "Too Short category name"],
            maxlength: [32, "Too long category name"],
        },
        slug: {
            type: String,
            lowercase: true,
        },
    },
    {timestamps: true}
);

const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;
