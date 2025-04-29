const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            trim: true,
            required: [true, "product name be Required"],
            minlength: [3, "Too short product name"],
            maxlength: [60, "Too long product name"],
        },
        slug: {
            type: String,
            slug: slugify("title"),
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, "product description is Required"],
            minlength: [3, "Too short product name"],
        },
        quantity: {
            type: Number,
            required: [true, "product quantity is Required"],
        },
        sold: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            trim: true,
            required: [true, "product price is Required"],
            max: [3200, "too long product price"],
        },
        priceAfterDiscount: {
            type: Number,
        },
        colors: [String],
        imageCover: {
            type: String,
            required: [true, "product image Cover is Required"],
        },
        images: [String],
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "category",
            required: [true, "product must be belong to category "],
        },
        subCategories: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "SubCategory",
            },
        ],
        brand: {
            type: mongoose.Schema.ObjectId,
            ref: "Brand",
        },
        ratingsAverage: {
            type: Number,
            min: [1, "Rating must be above or equal 1.0"],
            max: [5, "Rating must be below or equal 5.0"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
    },
    {timestamps: true}
);
productSchema.pre(/^find/, function (next) {
    this.populate({
        path: "category subCategories",
        select: "-_id name",
    });
    next();
});
module.exports = mongoose.model("Product", productSchema);
