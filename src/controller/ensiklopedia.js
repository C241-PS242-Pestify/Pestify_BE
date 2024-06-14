const prisma = require("../prisma");
const ClientError = require("../exceptions/ClientError");

const createEnsiklopedia = async (req, res) => {
  try {
    const {
      title,
      description,
      picture,
      additionalDescription1,
      additionalDescription2,
    } = req.body;

    const newEnsiklopedia = await prisma.ensiklopedia.create({
      data: {
        title,
        description,
        picture,
        additionalDescription1,
        additionalDescription2,
      },
    });

    res.status(201).json({
      message: "Ensiklopedia created successfully",
      newEnsiklopedia,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error creating Ensiklopedia:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const getAllEnsiklopedia = async (req, res) => {
  try {
    const ensiklopedia = await prisma.ensiklopedia.findMany();
    res.json(ensiklopedia);
  } catch (error) {
    console.error("Error fetching Ensiklopedia:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEnsiklopediaById = async (req, res) => {
  try {
    const { id } = req.params;
    const ensiklopedia = await prisma.ensiklopedia.findUnique({
      where: { id },
    });

    if (!ensiklopedia) {
      throw new ClientError("Ensiklopedia not found", 404);
    }

    res.json(ensiklopedia);
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error fetching Ensiklopedia by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const updateEnsiklopedia = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      picture,
      additionalDescription1,
      additionalDescription2,
    } = req.body;

    const updatedEnsiklopedia = await prisma.ensiklopedia.update({
      where: { id },
      data: {
        title,
        description,
        picture,
        additionalDescription1,
        additionalDescription2,
      },
    });

    res.json({
      message: "Ensiklopediaupdated successfully",
      updatedEnsiklopedia,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else if (error.code === "P2025") {
      res.status(404).json({ error: "Ensiklopedia not found" });
    } else {
      console.error("Error updating Ensiklopedia:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const deleteEnsiklopedia = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.ensiklopedia.delete({
      where: { id },
    });

    res.json({ message: "Ensiklopedia deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Ensiklopedia not found" });
    } else {
      console.error("Error deleting Ensiklopedia:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const searchEnsiklopediaByTitle = async (req, res) => {
  try {
    let { title } = req.query;

    if (!title) {
      return res
        .status(400)
        .json({ error: "Title query parameter is required" });
    }

    title = title.toLowerCase();

    const ensiklopedia = await prisma.ensiklopedia.findMany({
      where: {
        title: {
          contains: title,
        },
      },
    });

    res.json(ensiklopedia);
  } catch (error) {
    console.error("Error searching Ensiklopedia:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createEnsiklopedia,
  getAllEnsiklopedia,
  getEnsiklopediaById,
  updateEnsiklopedia,
  deleteEnsiklopedia,
  searchEnsiklopediaByTitle,
};
