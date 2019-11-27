import React from 'react';
import PropTypes from 'prop-types';
import * as tf from '@tensorflow/tfjs';
import CartPoleEngine from './CartPoleEngine';

import styles from '../styles/cartpole.module';

const TRAINING_BATCHES = 2;
const ROLLOUTS_PER_BATCH = 5;
const REWARD_DISCOUNT = .9;

class Trainer {
  static doTraining() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({inputShape: [4], units: 8, activation: 'relu'}),
        tf.layers.dense({units: 4, activation: 'relu'}),
        tf.layers.dense({units: 1, activation: 'sigmoid'}),
      ]
    });
    model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
    Trainer.doTrainingStep(model, 0);
  }

  static doTrainingStep(model, iteration) {
    if (iteration >= TRAINING_BATCHES) {
      console.log(`Training finished at iteration ${iteration}`);
      return;
    }
    console.log(`Getting rollouts for training iteration ${iteration}`);
    const rollouts = Array(ROLLOUTS_PER_BATCH).fill().map(() => {
        return Trainer.getRollout(model)
    });
    console.log(`Training for training iteration ${iteration}`);
    Trainer.trainModel(model, rollouts, iteration);
    console.log(`Done training iteration ${iteration}`);
  }
 
  static getRollout(model) {
    let state = CartPoleEngine.getInitialState();
    const rollout = [];
    while (!state.done) {
      const action = Trainer.getOnPolicyAction(model, state);
      rollout.push([state, action]);
      state = CartPoleEngine.step(action, state);
    }
    return Trainer.calculateRewards(rollout);
  }

  static getOnPolicyAction(model, state) {
    const stateTensor = Trainer._getTensorFromState(state);
    const predict = model.predict(stateTensor);
    const leftProbability = predict.arraySync()[0][0];
    return Math.random() <= leftProbability ? 0 : 1;
  }

  static calculateRewards(rollout) {
    rollout.reverse();
    let currReward = 0;
    const enhancedRollout = [];
    const allRewards = []
    rollout.forEach(([state, action]) => {
      currReward = 1 + (REWARD_DISCOUNT * currReward);
      enhancedRollout.push([state, action, currReward]);
      allRewards.push(currReward)
    });
    enhancedRollout.reverse();

    // normalize reward
    const moments = tf.moments(allRewards);
    const mean = moments.mean.arraySync();
    const stdDev = Math.sqrt(moments.variance.arraySync());
    const actionHistoryNormalizedReward = [];
    return enhancedRollout.map(([state, action, reward]) => {
      const normedReward = (reward - mean)/stdDev;
      return [state, action, normedReward];
    });
  }

  static trainModel(model, rollouts, iteration) {
    const states = rollouts.map((r) => r.map(([state, _, __]) => {
      return [state.x, state.xDot, state.theta, state.thetaDot];
    })).flat();
    const rewards = rollouts.map((r) => r.map(([_, __, r]) => r)).flat();
    const trainTensor = tf.tensor(states, [states.length, 4])
    const trainResults = tf.tensor(rewards, [rewards.length, 1])
    model.fit(trainTensor, trainResults).then(
      () => Trainer.doTrainingStep(model, iteration + 1)
    );
  }

  static _getTensorFromState(state) {
    const stateArr = [state.x, state.xDot, state.theta, state.thetaDot];
    return tf.tensor(stateArr, [1,4]);
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
