const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

const predictClassification = async (loadedModel, image) => {
  try {
    const buffer = Buffer.from(image);
    const decodedImage = tf.node.decodeImage(buffer, 3);

    const resizedImage = tf.image.resizeNearestNeighbor(
      decodedImage,
      [224, 224]
    );
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
      pest_description =
        "Aphids are very small (1-2 mm), soft and generally green in color. Aphids suck the liquid in plants so that the plants become weak. There are two types of aphids, winged and wingless, where the wings are used to move around. Aphids have colors such as green, red, brown, black, and yellow.";
      pest_cause = "Spread due to aphids' ability to fly.";
      pest_effect =
        "1. Leaves shrivel, wilt, or turn yellow\n2. stunted plant growth\n3. fungal growth due to infection from aphids";
      solution =
        "1. Utilize insects such as ladybirds, ants, beetles to control aphid populations.\n2. Conducting ruitn watering with a controlled amount of water to cause humidity\n3. Using insecticidal soap";
    } else if (pest_name === "Mealybugs") {
      pest_description =
        "Mealybugs are pests that are generally pink in color, soft in body, and covered in a white, sticky, soft coating that protects them from overheating and moisture loss. Commonly found on the lunal/leafy parts of plants. It has a size of <5 mm. There will be cycles in their life cycle where they will develop wings.";
      pest_cause =
        "Infection from infected plants and in climates that tend to be warm and humid.";
      pest_effect =
        "Plants infected with mealybugs will lack nutrients so that they will turn yellow, lack of growth power, and even death in plants.";
      solution =
        "1. Water regularly using water and neem oil or horticultural oil.\n2. Raise insects such as ants or green mesh flies to control mealybugs.\n3. Use insecticidal soap";
    } else if (pest_name === "Whiteflies") {
      pest_description =
        "Whiteflies are pests that are often found on greenhouse plants. They measure 1.6-2.5 mm and have 4 wings covered in a white liquid.";
      pest_cause =
        "It arises due to infection from infected plants with warm weather and the absence of predators that prey on them.";
      pest_effect =
        "Plants infected by whiteflies will lack nutrients, making it difficult for plants to grow, their leaves turn yellow, and can cause growth failure.";
      solution =
        "Use insecticidal soaps and cultivate insects that are predators of whiteflies such as ladybird beetles/chickadees.";
    }

    console.log("Pest Description:\n" + pest_description);
    console.log("Pest Cause:\n" + pest_cause);
    console.log("Pest Effect:");
    console.log(pest_effect);
    console.log("Solution:");
    console.log(solution);

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
