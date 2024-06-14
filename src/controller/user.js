const prisma = require("../prisma");
const ClientError = require("../exceptions/ClientError");
const InputError = require("../exceptions/InputError");

const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new InputError("User ID is required");
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ClientError("User not found", 404);
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof ClientError || error instanceof InputError) {
      res.status(error.statusCode || 400).json({ error: error.message });
    } else {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const searchByEmail = async (req, res) => {
  try {
    let { email } = req.query;

    if (!email) {
      throw new InputError("Email query parameter is required");
    }

    email = email.toLowerCase();

    const users = await prisma.user.findMany({
      where: {
        email: { contains: email },
      },
    });

    if (users.length === 0) {
      throw new ClientError("No users found with the provided email", 404);
    }

    res.json(users);
  } catch (error) {
    if (error instanceof ClientError || error instanceof InputError) {
      res.status(error.statusCode || 400).json({ error: error.message });
    } else {
      console.error("Error searching user by email:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = { getAllUser, deleteUser, searchByEmail };
