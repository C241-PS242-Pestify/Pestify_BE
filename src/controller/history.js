const prisma = require("../prisma");
const ClientError = require("../exceptions/ClientError");
const InputError = require("../exceptions/InputError");

const getAllHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      throw new InputError("User ID is required");
    }

    const userHistory = await prisma.history.findMany({
      where: { userId: userId },
      include: {
        pest: true,
      },
    });

    res.status(200).json({
      status: "success",
      data: userHistory,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error fetching user history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new InputError("History ID is required");
    }

    const history = await prisma.history.findUnique({
      where: { id: id },
      include: {
        pest: true,
      },
    });

    if (!history) {
      throw new ClientError("History not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: history,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error fetching history by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const deleteHistoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new InputError("History ID is required");
    }

    const deletedHistory = await prisma.history.delete({
      where: { id: id },
    });

    res.status(200).json({
      status: "success",
      message: "History deleted successfully",
      data: deletedHistory,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error deleting history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = {
  getAllHistory,
  getHistoryById,
  deleteHistoryById,
};
