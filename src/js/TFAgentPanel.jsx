import React from 'react';
import PropTypes from 'prop-types';
import * as tf from '@tensorflow/tfjs';
import CartPoleEngine from './CartPoleEngine';

import styles from '../styles/cartpole.module';

class Trainer {
  static doSteps(model, state, actionHistory, resolve) {
    const inputArray = [state.x, state.xDot, state.theta, state.thetaDot];
    const predict = model.predict(tf.tensor(inputArray, [1,4]));
    predict.array().then((result) => {
      const leftProbability = result[0][0];
      const action = Math.random() <= leftProbability ? 0 : 1;
      actionHistory.push([inputArray, action])
      const newState = CartPoleEngine.step(action, state);
      if (!newState.done) {
        Trainer.doSteps(model, newState, actionHistory, resolve)
      } else {
        resolve(actionHistory);
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
    const actionHistory = [];

    const promise = new Promise((resolve, reject) => {
        Trainer.doSteps(model, initState, actionHistory, resolve)
    });
    promise.then((actionHistory) => {
      actionHistory.reverse();
      const DISCOUNT = .9;
      let count = 0;
      let currReward = 0;
      const actionHistoryReward = [];
      actionHistory.forEach(([input, action]) => {
        currReward = 1 + (DISCOUNT * currReward );
        actionHistoryReward.push([
          input,
          action,
          currReward
        ]);
      });
      actionHistoryReward.reverse();
      actionHistoryReward.forEach(([input, action, reward]) => {
        console.log(`Action: ${action}, Reward ${reward}`);
      });
    });
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
