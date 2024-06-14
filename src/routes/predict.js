const express = require('express');
const multer = require('multer');
const authenticateToken = require('../middleware/authToken');
const predictController = require('../controller/predict');

const router = express.Router();
const upload = multer();

router.post('/predict', authenticateToken, upload.single('image'), predictController.handlePredict);

router.post('/predict/save', authenticateToken, predictController.savePrediction);

module.exports = router;