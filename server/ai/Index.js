import * as tf from "@tensorflow/tfjs-node";

// This function creates and trains a simple linear regression model.
const runLinearRegression = async () => {
  // Create a sequential model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  // Compile the model with a loss function and an optimizer
  model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

  // Synthetic training data
  const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]); // Assuming the function is y = 2x - 1

  // Train the model with the data
  await model.fit(xs, ys, { epochs: 250 });

  // Predict the output for a new data point
  model.predict(tf.tensor2d([5], [1, 1])).print();
};

// Kick off the model training
runLinearRegression();
