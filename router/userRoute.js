const express = require("express");
const {
    getUserValidator,
    createUserValidator,
    updataUserValidator,
    deleteUserValidator,
} = require("../utils/validators/userValidator");
const {
    createUser,
    getUser,
    getUsers,
    updataUser,
    deleteUser,
    getUserImage,
    resizeImage,
} = require("../services/userService");

const router = express.Router();

router
    .route("/")
    .get(getUsers)
    .post(getUserImage, resizeImage, createUserValidator, createUser);
router
    .route("/:id")
    .get(getUserValidator, getUser)
    .put(getUserImage, resizeImage, updataUserValidator, updataUser)
    .delete(deleteUserValidator, deleteUser);

module.exports = router;
