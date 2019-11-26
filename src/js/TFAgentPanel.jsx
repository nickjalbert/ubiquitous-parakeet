import React from 'react';
import PropTypes from 'prop-types';
import * as tf from '@tensorflow/tfjs';
import CartPoleEngine from './CartPoleEngine';

import styles from '../styles/cartpole.module';

class Trainer {
  static doSteps(model, state) {
    const inputArray = [state.x, state.xDot, state.theta, state.thetaDot];
    const predict = model.predict(tf.tensor(inputArray, [1,4]));
    predict.array().then((result) => {
      const leftProbability = result[0][0];
      const action = Math.random() <= leftProbability ? 0 : 1;
      const newState = CartPoleEngine.step(action, state);
      console.log(`Action: ${action === 0 ? 'left' : 'right'}`);
      if (!newState.done) {
        Trainer.doSteps(model, newState)
      } else {
        console.log(`Total reward: ${newState.totalReward}`);
      }
    });
  }

  static doTraining() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({inputShape: [4], units: 32, activation: 'relu'}),
        tf.layers.dense({units: 16, activation: 'relu'}),
        tf.layers.dense({units: 2, activation: 'softmax'}),
      ]
    });
    model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
    const initState = CartPoleEngine.getInitialState();
    Trainer.doSteps(model, initState);
  }
}

function doTensorFlow() {
  // Define a model for linear regression.
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  // Generate some synthetic data for training.
  const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

  // Train the model using the data.
  model.fit(xs, ys, { epochs: 10 }).then(() => {
    // Use the model to do inference on a data point the model hasn't seen before:
    // Open the browser devtools to see the output
    model.predict(tf.tensor2d([5], [1, 1])).print();
  });
}

function TFAgentPanel(props) {
  return (
    <div className={styles.controls__panel}>
      <button className={styles.controls__button} onClick={Trainer.doTraining}>
        Do TensorFlow
      </button>
    </div>
  );
}

TFAgentPanel.propTypes = { };

export default TFAgentPanel;
