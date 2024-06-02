const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authToken');
const authorizeAdmin = require('../middleware/authAdmin');
const articleController = require('../controller/article');

router.post('/articles', authenticateToken, authorizeAdmin, articleController.createArticle);

router.put('/articles/:id', authenticateToken, authorizeAdmin, articleController.updateArticle);

router.delete('/articles/:id', authenticateToken, authorizeAdmin, articleController.deleteArticle);

router.get('/articles', authenticateToken, articleController.getAllArticles);

router.get('/articles/:id', authenticateToken, articleController.getArticleById);

router.get('/search/articles', authenticateToken, articleController.searchArticles);

module.exports = router;
