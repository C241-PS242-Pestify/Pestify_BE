const express = require('express');
const authenticateToken = require('../middleware/authToken');
const detailController = require('../controller/detailUser');

const router = express.Router();

router.get('/user-info', authenticateToken, detailController.getUserInfo);

router.put('/update-photo', authenticateToken, detailController.updateProfilePhoto);

module.exports = router;