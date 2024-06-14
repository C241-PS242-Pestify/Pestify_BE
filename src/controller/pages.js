const prisma = require("../prisma");
const ClientError = require("../exceptions/ClientError");

const home = (req, res) => {
  res.json({ message: "Welcome to the Home page" });
};

const pestDetection = (req, res) => {
  res.json({ message: "Welcome to the Pest Detection page" });
};

const ensiklopedia = (req, res) => {
  res.json({ message: "Welcome to the Ensiklopedia page" });
};

const history = (req, res) => {
  res.json({ message: "Welcome to the History page" });
};

const profile = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      throw new ClientError("User ID is required", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        profile_Photo: true,
      },
    });

    if (!user) {
      throw new ClientError("User not found", 404);
    }

    res.json({ user });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = { home, pestDetection, ensiklopedia, history, profile };