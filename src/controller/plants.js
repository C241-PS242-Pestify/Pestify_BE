const prisma = require("../prisma");
const ClientError = require("../exceptions/ClientError");
const InputError = require("../exceptions/InputError");

const createPlant = async (req, res) => {
  try {
    const { title, description, picture } = req.body;

    if (!title || !description || !picture) {
      throw new InputError("Title, description, and picture are required");
    }

    const newPlant = await prisma.plants.create({
      data: { title, description, picture },
    });
    res.status(201).json({
      message: "Plant created successfully",
      newPlant,
    });
  } catch (error) {
    if (error instanceof InputError || error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error creating plant:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const getAllPlants = async (req, res) => {
  try {
    const plants = await prisma.plants.findMany();
    res.json(plants);
  } catch (error) {
    console.error("Error fetching plants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPlantById = async (req, res) => {
  try {
    const { id } = req.params;
    const plant = await prisma.plants.findUnique({
      where: { id },
    });
    if (!plant) {
      throw new ClientError("Plant not found", 404);
    }
    res.json(plant);
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error fetching plant by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const updatePlant = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, picture } = req.body;

    if (!title || !description || !picture) {
      throw new InputError("Title, description, and picture are required");
    }

    const updatedPlant = await prisma.plants.update({
      where: { id },
      data: { title, description, picture },
    });
    res.json(updatedPlant);
  } catch (error) {
    if (error instanceof InputError || error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else if (error.code === "P2025") {
      res.status(404).json({ error: "Plant not found" });
    } else {
      console.error("Error updating plant:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const deletePlant = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.plants.delete({
      where: { id },
    });
    res.json({ message: "Plant deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Plant not found" });
    } else {
      console.error("Error deleting plant:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
};
