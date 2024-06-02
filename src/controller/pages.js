const prisma = require("../prisma");

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
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { home, pestDetection, ensiklopedia, history, profile };
