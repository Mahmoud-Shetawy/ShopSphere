const express = require("express");
const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
    updateLoggerValidator,
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
    getLoggedUserDate,
    updateLoggedUserPassword,
    updateLoggedUserDate,
    deleteLoggedUser,
} = require("../services/userService");

const {protect, allowedTo} = require("../services/authService");

const router = express.Router();

router.use(protect);

router.get("/getMe", getLoggedUserDate, getUser);
router.put("/updateMyPassword", updateLoggedUserPassword);
router.put("/updateMy", updateLoggerValidator, updateLoggedUserDate);
router.put("/deleteMy", deleteLoggedUser);

router.use(allowedTo("admin"));

router.put(
    "/changePassword/:id",
    changeUserPasswordValidator,
    changeUserPassword
);
router
    .route("/")
    .get(protect, allowedTo("admin"), getUsers)
    .post(getUserImage, resizeImage, createUserValidator, createUser);
router
    .route("/:id")
    .get(getUserValidator, getUser)
    .put(getUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

module.exports = router;
