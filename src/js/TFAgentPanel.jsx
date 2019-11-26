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
        tf.layers.dense({units: 1, activation: 'sigmoid'}),
      ]
    });
    model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
    let i = 0;
    while (i < 5)  {
      console.log(`Training step: ${i}`);
      Trainer.trainAStep(model)
      i += 1;
    }
  }

  static trainAStep(model) {
    const initState = CartPoleEngine.getInitialState();
    const actionHistory = [];
    const promise = new Promise((resolve, reject) => {
        Trainer.doSteps(model, initState, actionHistory, resolve)
    });
    promise.then((actionHistory) => {
      // calculate discounted reward
      actionHistory.reverse();
      const DISCOUNT = .9;
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

      // normalize reward
      const allRewards = []
      actionHistoryReward.forEach(([s, a, r]) => allRewards.push(r));
      const moments = tf.moments(allRewards);
      const mean = moments.mean.arraySync();
      const stdDev = Math.sqrt(moments.variance.arraySync());
      const actionHistoryNormalizedReward = [];
      actionHistoryReward.forEach(([s, a, r]) => {
        const normedR = (r - mean)/stdDev;
        actionHistoryNormalizedReward.push([s, a, normedR]);
      });

      const states = actionHistoryNormalizedReward.map(([s, a, r]) => s);
      const rewards = actionHistoryNormalizedReward.map(([s, a, r]) => r);
      const trainTensor = tf.tensor(states, [states.length, 4])
      const trainResults = tf.tensor(rewards, [states.length, 1])
      const h = model.fit(trainTensor, trainResults);
      return h;
    }).then((h) => {console.log(h.history.loss)});
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
