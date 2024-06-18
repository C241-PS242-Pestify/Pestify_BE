const predictClassification = require("../services/inferenceService");
const loadModel = require("../services/loadModel");
const prisma = require("../prisma");
const InputError = require("../exceptions/InputError");

const handlePredict = async (req, res) => {
  try {
    const image = req.file ? req.file.buffer : null;
    const model = await loadModel();

    if (!image) {
      throw new InputError("Image is required");
    }

    const {
      confidenceScore,
      pest_name,
      pest_description,
      pest_effect,
      pest_cause,
      solution,
    } = await predictClassification(model, image);

    const additional_image = req.body.additional_image || null;

    const data = {
      pest_name: pest_name,
      pest_description: pest_description,
      pest_cause: pest_cause,
      pest_effect: pest_effect,
      solution: solution,
      confidenceScore: confidenceScore,
      additional_image: additional_image,
    };

    const prediction = await prisma.Pest_Detection.create({
      data: {
        pest_name: data.pest_name,
        pest_description: data.pest_description,
        pest_cause: data.pest_cause,
        pest_effect: data.pest_effect,
        Solution: data.solution,
        confidenceScore: data.confidenceScore,
        additional_image: data.additional_image,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Prediction successful",
      data: prediction,
    });
  } catch (error) {
    if (error instanceof InputError) {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error during prediction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

const savePrediction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { predictionId, save } = req.body;

    if (!predictionId) {
      throw new InputError("Prediction ID is required");
    }

    if (save) {
      const savedPrediction = await prisma.history.create({
        data: {
          userId: userId,
          pestId: predictionId,
        },
      });

      return res.status(201).json({
        status: "success",
        message: "Prediction saved successfully",
        data: savedPrediction,
      });
    } else {
      const deletedPrediction = await prisma.pest_Detection.delete({
        where: {
          id: predictionId,
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Prediction deleted successfully",
        data: deletedPrediction,
      });
    }
  } catch (error) {
    if (error instanceof InputError) {
      res.status(400).json({ error: error.message });
    } else if (error.code === "P2025") {
      res.status(404).json({ error: "Prediction not found" });
    } else {
      console.error("Error saving or deleting prediction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = {
  handlePredict,
  savePrediction,
};
