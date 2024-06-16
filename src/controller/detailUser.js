const prisma = require("../prisma");
const multer = require('multer');
const ClientError = require("../exceptions/ClientError");
const InputError = require("../exceptions/InputError");

const getUserInfo = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        username: true,
        profile_Photo: true,
      },
    });

    if (!user) {
      throw new ClientError("User not found", 404);
    }

    res.json({ username: user.username, profile_Photo: user.profile_Photo });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error fetching user info:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      throw new InputError('Profile photo is required');
    }

    const profilePhoto = req.file.encoding;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { profile_Photo: profilePhoto },
    });

    res.status(200).json({
      message: 'Profile photo updated successfully',
      updatedUser,
    });
  } catch (error) {
    if (error instanceof InputError || error.code === 'P2025') {
      res.status(400).json({ error: error.message });
    } else if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'File size exceeds limit of 5MB' });
      } else {
        res.status(500).json({ error: 'Multer error: ' + error.message });
      }
    } else {
      console.error('Error updating profile photo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = {
  getUserInfo,
  updateProfilePhoto,
};
