const prisma = require("../prisma");
const ClientError = require("../exceptions/ClientError");

const VALID_TAGS = ["Story", "Tips", "Lifestyle"];

const createArticle = async (req, res) => {
  try {
    const { title, tags, description, picture } = req.body;

    if (!VALID_TAGS.includes(tags)) {
      throw new ClientError(
        "Invalid tag. Valid tags are 'Story', 'Tips', 'Lifestyle'."
      );
    }

    const newArticle = await prisma.article.create({
      data: { title, tags, description, picture },
    });

    res.status(201).json({
      message: "Article created successfully",
      newArticle,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error creating article:", error);
      res.status(500).json({ error: "Internal server error" });
    }
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
      where: { id },
    });
    if (!article) {
      throw new ClientError("Article not found", 404);
    }
    res.json(article);
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tags, description, picture } = req.body;

    if (tags && !VALID_TAGS.includes(tags)) {
      throw new ClientError(
        "Invalid tag. Valid tags are 'Story', 'Tips', 'Lifestyle'."
      );
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: { title, tags, description, picture },
    });
    res.json(updatedArticle);
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else if (error.code === "P2025") {
      res.status(404).json({ error: "Article not found" });
    } else {
      console.error("Error updating article:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({ where: { id } });
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Article not found" });
    } else {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const getArticlesByStoryTag = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: {
        tags: "Story",
      },
    });
    res.json(articles);
  } catch (error) {
    console.error("Error fetching 'Story' articles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getArticlesByTipsTag = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: {
        tags: "Tips",
      },
    });
    res.json(articles);
  } catch (error) {
    console.error("Error fetching 'Tips' articles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getArticlesByLifestyleTag = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: {
        tags: "Lifestyle",
      },
    });
    res.json(articles);
  } catch (error) {
    console.error("Error fetching 'Lifestyle' articles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticlesByStoryTag,
  getArticlesByTipsTag,
  getArticlesByLifestyleTag,
};
