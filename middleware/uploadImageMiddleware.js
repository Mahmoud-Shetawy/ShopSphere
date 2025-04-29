const multer = require("multer");
const ApiError = require("../utils/apiError");

exports.uploadSingleImage = (fieldName) => {
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith("image")) cb(null, true);
        else cb(new ApiError("Only images allow upload ", 400), false);
    };
    const multerStorage = multer.memoryStorage();
    const upload = multer({storage: multerStorage, fileFilter: multerFilter});
    return upload.single(fieldName);
};
