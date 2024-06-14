const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authToken');
const historyController = require('../controller/history');

router.get('/', authenticateToken, historyController.getAllHistory);

router.get('/:id', authenticateToken, historyController.getHistoryById);

router.delete('/:id', authenticateToken, historyController.deleteHistoryById);

module.exports = router;