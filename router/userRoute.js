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

const {protect, allowedTo} = require("../services/authService");

const router = express.Router();

router.put(
    "/changePassword/:id",
    changeUserPasswordValidator,
    changeUserPassword
);
router
    .route("/")
    .get(protect, allowedTo("admin"), getUsers)
    .post(
        protect,
        allowedTo("admin"),
        getUserImage,
        resizeImage,
        createUserValidator,
        createUser
    );
router
    .route("/:id")
    .get(getUserValidator, getUser)
    .put(
        protect,
        allowedTo("admin"),
        getUserImage,
        resizeImage,
        updateUserValidator,
        updateUser
    )
    .delete(protect, allowedTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
