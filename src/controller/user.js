const prisma = require("../prisma");

const getAlluser = async (req, res) => {
  try {
    const user = await prisma.user.findMany();
    res.json(user);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'user deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const searchByEmail = async (req, res) => {
  try {
    let { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }
    email = email.toLowerCase();
    const user = await prisma.user.findMany({
      where: {
        email: { contains: email },
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Error searching user by email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAlluser, deleteUser, searchByEmail };
