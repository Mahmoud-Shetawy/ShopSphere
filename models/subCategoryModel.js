const mongoose = require("mongoose");
const slugify = require("slugify");

const SubCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            require: [true, "SubCategory name is required"],
            minlength: [2, "Too Short SubCategory Name "],
            maxlength: [32, "Too Long SubCategory Name "],
        },
        slug: {
            type: String,
            slug: slugify("name"),
            lowercase: true,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "category",
            required: [true, "SubCategory must be belong to category "],
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("SubCategory", SubCategorySchema);
