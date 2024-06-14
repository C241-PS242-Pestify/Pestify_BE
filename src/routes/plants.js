const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authToken');
const authorizeAdmin = require('../middleware/authAdmin');
const plantsController = require('../controller/plants');

router.post('/plants', authenticateToken, authorizeAdmin, plantsController.createPlant);

router.get('/plants', authenticateToken, plantsController.getAllPlants);

router.get('/plants/:id', authenticateToken, plantsController.getPlantById);

router.put('/plants/:id', authenticateToken, authorizeAdmin, plantsController.updatePlant);

router.delete('/plants/:id', authenticateToken, authorizeAdmin, plantsController.deletePlant);

module.exports = router;
