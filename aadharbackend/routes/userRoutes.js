const express = require("express");
const { registerUser } = require("../controllers/userController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/register-user", registerUser);
router.put('/update-profile', userController.updateUserProfile);

module.exports = router;