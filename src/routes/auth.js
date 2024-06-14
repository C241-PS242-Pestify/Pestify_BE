const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const authenticateToken = require("../middleware/authToken");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.put('/update', authenticateToken, authController.updateAccount);

router.post("/logout", authenticateToken, authController.logout);

module.exports = router;