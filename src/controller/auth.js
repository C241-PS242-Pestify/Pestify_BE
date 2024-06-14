const prisma = require("../prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ClientError = require("../exceptions/ClientError");
const InputError = require("../exceptions/InputError");

require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const register = async (req, res) => {
  try {
    const { username, email, password, profile_Photo } = req.body;

    if (!username || !email || !password) {
      throw new InputError("Username, email, and password are required");
    }

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      throw new ClientError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profile_Photo: profile_Photo || null,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new InputError("Email and password are required");
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new ClientError("User not found", 404);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new ClientError("Invalid password", 401);
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      secretKey,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const updateAccount = async (req, res) => {
  try {
    const { userId } = req.user;
    const { username, email, password } = req.body;

    if (!username && !email && !password) {
      throw new ClientError("Username, email, and password are required", 400);
    }

    if (email) {
      const existingUser = await prisma.user.findFirst({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
        throw new ClientError("Email already in use", 400);
      }
    }

    let hashedPassword;
    
    if (password) {
      hashedPassword = await bcrypt.hash(password, 8);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: username || undefined,
        email: email || undefined,
        password: hashedPassword || undefined,
      },
    });

    res.json({ message: "Account updated successfully", updatedUser });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error updating account:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  register,
  login,
  updateAccount,
  logout,
};
