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

//deleteUser

//searchByEmail

module.exports = { getAlluser, deleteUser, searchByEmail };
