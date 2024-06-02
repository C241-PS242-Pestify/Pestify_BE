const prisma = require("../prisma");

const createArticle = async (req, res) => {
  try {
    const { title, tags, teks_article, picture } = req.body;

    const newArticle = await prisma.article.create({
      data: { title, tags, teks_article, picture },
    });

    res.status(201).json({
      message: "Article created successfully",
      newArticle,
    });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tags, teks_article, picture } = req.body;
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { title, tags, teks_article, picture },
    });
    res.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const searchArticles = async (req, res) => {
  try {
    let { title, tags } = req.query;
    let articles = [];

    title = title ? title.toLowerCase() : null;
    tags = tags ? tags.toLowerCase() : null;

    if (title) {
      articles = await prisma.article.findMany({
        where: {
          title: { contains: title },
        },
      });
    } else if (tags) {
      articles = await prisma.article.findMany({
        where: {
          tags: { contains: tags },
        },
      });
    } else {
      return res
        .status(400)
        .json({ error: "Title or tags query parameter is required" });
    }

    res.json(articles);
  } catch (error) {
    console.error("Error searching articles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles,
};
