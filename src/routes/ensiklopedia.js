const express = require("express");
const router = express.Router();
const authenticateToken = require('../middleware/authToken');
const authorizeAdmin = require('../middleware/authAdmin');
const ensiklopediaController= require("../controller/ensiklopedia");

router.post("/ensiklopedia", authenticateToken, authorizeAdmin, ensiklopediaController.createEnsiklopedia);

router.get("/ensiklopedia", authenticateToken, ensiklopediaController.getAllEnsiklopedia);

router.get("/ensiklopedia/:id", authenticateToken, ensiklopediaController.getEnsiklopediaById);

router.put("/ensiklopedia/:id", authenticateToken, authorizeAdmin, ensiklopediaController.updateEnsiklopedia);

router.delete("/ensiklopedia/:id", authenticateToken, authorizeAdmin, ensiklopediaController.deleteEnsiklopedia);

router.get('/search/ensiklopedia', authenticateToken, ensiklopediaController.searchEnsiklopediaByTitle);

module.exports = router;