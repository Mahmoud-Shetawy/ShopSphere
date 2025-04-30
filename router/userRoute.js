const express = require("express");
const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
} = require("../utils/validators/userValidator");
const {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    getUserImage,
    resizeImage,
    changeUserPassword,
} = require("../services/userService");

const router = express.Router();

router.put(
    "/changePassword/:id",
    changeUserPasswordValidator,
    changeUserPassword
);
router
    .route("/")
    .get(getUsers)
    .post(getUserImage, resizeImage, createUserValidator, createUser);
router
    .route("/:id")
    .get(getUserValidator, getUser)
    .put(getUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

module.exports = router;
