const tf = require('@tensorflow/tfjs-node');
const InputError = require("../exceptions/InputError");

const predictClassification = async (loadedModel, image) => {
  try {
    const buffer = Buffer.from(image);  // image is the buffer of the uploaded image file
    const decodedImage = tf.node.decodeImage(buffer, 3);  // 3 channels (RGB)

    const resizedImage = tf.image.resizeNearestNeighbor(decodedImage, [224, 224]);
    const expandedImage = resizedImage.expandDims(0);
    const normalizedImage = expandedImage.toFloat().div(tf.scalar(255.0));

    const prediction = loadedModel.predict(normalizedImage);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classes = ["Aphids", "Mealybugs", "Whiteflies"];
    const classIndex = score.indexOf(Math.max(...score));
    const pest_name = classes[classIndex];

    let pest_description, pest_cause, pest_effect, solution;
    if (pest_name === "Aphids") {
      pest_description = "Aphids description";
      pest_cause = "Aphids cause";
      pest_effect = "Aphids effect";
      solution = "Aphids suggestion";
    } else if (pest_name === "Mealybugs") {
      pest_description = "Mealybugs description";
      pest_cause = "Mealybugs cause";
      pest_effect = "Mealybugs effect";
      solution = "Mealybugs suggestion";
    } else if (pest_name === "Whiteflies") {
      pest_description = "Whiteflies description";
      pest_cause = "Whiteflies cause";
      pest_effect = "Whiteflies effect";
      solution = "Whiteflies suggestion";
    }

    return {
      confidenceScore,
      pest_name,
      pest_description,
      pest_effect,
      pest_cause,
      solution,
    };
  } catch (error) {
    throw new InputError(`Input error: ${error.message}`);
  }
};

module.exports = predictClassification;
