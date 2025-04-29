const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "brand required"],
            unique: [true, "brand must be unique"],
            minlength: [3, "Too Short brand name"],
            maxlength: [32, "Too long brand name"],
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
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
};
brandSchema.post("init", (doc) => {
    setImageUrl(doc);
});
brandSchema.post("save", (doc) => {
    setImageUrl(doc);
});
module.exports = mongoose.model("Brand", brandSchema);
