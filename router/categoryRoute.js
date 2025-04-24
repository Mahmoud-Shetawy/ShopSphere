const express = require("express");
const {
    createCategory,
    getCategories,
    getCategory,
    updataCategory,
    deleteCategory,
} = require("../services/categoryService");

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);
router
    .route("/:id")
    .get(getCategory)
    .put(updataCategory)
    .delete(deleteCategory);
module.exports = router;
