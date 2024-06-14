const express = require("express");
const router = express.Router();
const pagesController = require("../controller/pages");
const authenticateToken = require("../middleware/authToken");

router.get("/home", authenticateToken, pagesController.home);

router.get("/pest-detection", authenticateToken, pagesController.pestDetection);

router.get("/ensiklopedia", authenticateToken, pagesController.ensiklopedia);

router.get("/history", authenticateToken, pagesController.history);

router.get("/profile", authenticateToken, pagesController.profile);

module.exports = router;