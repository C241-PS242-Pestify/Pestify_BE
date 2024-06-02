const express = require('express')
const router = express.Router();
const userController = require('../controller/user');
const authenticateToken = require('../middleware/authToken');
const authorizeAdmin = require('../middleware/authAdmin');

router.get('/', authenticateToken, authorizeAdmin, userController.getAlluser);

router.get('/search', authenticateToken, authorizeAdmin, userController.searchByEmail);

router.delete('/:id', authenticateToken, authorizeAdmin, userController.deleteUser);

module.exports = router;
