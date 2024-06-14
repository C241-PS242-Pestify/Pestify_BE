const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authToken');
const authorizeAdmin = require('../middleware/authAdmin');
const articleController = require('../controller/articles');

router.post('/articles', authenticateToken, authorizeAdmin, articleController.createArticle);

router.put('/articles/:id', authenticateToken, authorizeAdmin, articleController.updateArticle);

router.delete('/articles/:id', authenticateToken, authorizeAdmin, articleController.deleteArticle);

router.get('/articles', authenticateToken, articleController.getAllArticles);

router.get('/articles/:id', authenticateToken, articleController.getArticleById);

router.get('/story/articles', authenticateToken, articleController.getArticlesByStoryTag);

router.get('/tips/articles', authenticateToken, articleController.getArticlesByTipsTag);

router.get('/lifestyle/articles', authenticateToken, articleController.getArticlesByLifestyleTag);

module.exports = router;