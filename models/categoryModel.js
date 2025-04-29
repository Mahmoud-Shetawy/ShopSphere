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
        image: String,
    },
    {timestamps: true}
);

const setImageUrl = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageUrl;
    }
};
categorySchema.post("init", (doc) => {
    setImageUrl(doc);
});
categorySchema.post("save", (doc) => {
    setImageUrl(doc);
});
module.exports = mongoose.model("category", categorySchema);
