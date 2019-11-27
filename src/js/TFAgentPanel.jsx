import React from 'react';
import * as tf from '@tensorflow/tfjs';
import CartPoleEngine from './CartPoleEngine';

import styles from '../styles/cartpole.module';

const TRAINING_BATCHES = 2;
const ROLLOUTS_PER_BATCH = 2;
const REWARD_DISCOUNT = 0.9;

class Trainer {
  static doTraining() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [4], units: 12, activation: 'relu' }),
        tf.layers.dense({ units: 12, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' }),
      ],
    });
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
    Trainer.doTrainingStep(model, 0);
  }

  static doTrainingStep(model, iteration) {
    if (iteration >= TRAINING_BATCHES) {
      console.log(`Training finished at iteration ${iteration}`);
      return;
    }
    console.log(`Getting rollouts for training iteration ${iteration}`);
    const rolloutFn = () => Trainer.getRollout(model);
    const rollouts = Array(ROLLOUTS_PER_BATCH).fill().map(rolloutFn);
    console.log(`Training for training iteration ${iteration}`);
    Trainer.trainModel(model, rollouts, iteration);
    const actions = rollouts.reduce((a, b) => a + b.length, 0);
    const avgR = actions / rollouts.length;
    console.log(`Done training batch ${iteration}: ${avgR} avg reward`);
  }

  static getRollout(model) {
    let state = CartPoleEngine.getInitialState();
    const rollout = [];
    while (!state.done) {
      const stateTensor = Trainer.getTensorFromState(state);
      const action = Trainer.getOnPolicyAction(model, stateTensor);
      rollout.push([stateTensor, action]);
      state = CartPoleEngine.step(action, state);
    }
    return Trainer.calculateRewards(rollout);
  }

  static getOnPolicyAction(model, stateTensor) {
    const predict = model.predict(stateTensor);
    const leftProbability = predict.arraySync()[0][0];
    return Math.random() <= leftProbability ? 0 : 1;
  }

  static calculateRewards(rollout) {
    rollout.reverse();
    let currReward = 0;
    const enhancedRollout = [];
    const allRewards = [];
    rollout.forEach(([state, action]) => {
      currReward = 1 + (REWARD_DISCOUNT * currReward);
      enhancedRollout.push([state, action, currReward]);
      allRewards.push(currReward);
    });
    enhancedRollout.reverse();

    // normalize reward
    const moments = tf.moments(allRewards);
    const mean = moments.mean.arraySync();
    const stdDev = Math.sqrt(moments.variance.arraySync());
    return enhancedRollout.map(([state, action, reward]) => {
      const normedReward = (reward - mean) / stdDev;
      return [state, action, normedReward];
    });
  }

  static trainModel(model, rollouts, iteration) {
    const stateFn = (roll) => roll[0].arraySync()[0];
    const states = rollouts.map((rollout) => rollout.map(stateFn)).flat();
    const rewardFn = (roll) => roll[2];
    const rewards = rollouts.map((rollout) => rollout.map(rewardFn)).flat();
    const trainTensor = tf.tensor(states, [states.length, 4]);
    const trainResults = tf.tensor(rewards, [rewards.length, 1]);
    model.fit(trainTensor, trainResults).then(
      () => Trainer.doTrainingStep(model, iteration + 1),
    );
  }

  static getTensorFromState(state) {
    const stateArr = [state.x, state.xDot, state.theta, state.thetaDot];
    return tf.tensor(stateArr, [1, 4]);
  }
}


function TFAgentPanel() {
  return (
    <div className={styles.controls__panel}>
      <button className={styles.controls__button} onClick={Trainer.doTraining}>
        Do TensorFlow
      </button>
    </div>
  );
}

export default TFAgentPanel;
