import React from 'react';
import * as tf from '@tensorflow/tfjs';
import CartPoleEngine from './CartPoleEngine';

import styles from '../styles/cartpole.module';

const TRAINING_BATCHES = 20;
const ROLLOUTS_PER_BATCH = 10;
const REWARD_DISCOUNT = 0.9;

class Trainer {
  static doTraining() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [4], units: 4, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' }),
      ],
    });
    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy' });
    Trainer.doTrainingStep(model, 0);
  }

  static doTrainingStep(model, iteration) {
    if (iteration >= TRAINING_BATCHES) {
      console.log(`Training finished at iteration ${iteration}`);
      return;
    }
    console.log(`Getting rollouts for training iteration ${iteration}`);
    const rolloutFn = () => Trainer.getRollout(model, true);
    const rollouts = Array(ROLLOUTS_PER_BATCH).fill().map(rolloutFn);
    console.log(`Training for training iteration ${iteration}`);
    Trainer.trainModel(model, rollouts, iteration);

    const trainedRolloutFn = () => Trainer.getRollout(model, false);
    const trainedRollouts = Array(ROLLOUTS_PER_BATCH).fill().map(trainedRolloutFn)
    const actions = trainedRollouts.reduce((a, b) => a + b.length, 0);
    const avgR = actions / trainedRollouts.length;
    console.log(`Done training batch ${iteration}: ${avgR} avg reward`);
  }

  static getRollout(model, explore) {
    let state = CartPoleEngine.getInitialState();
    const rollout = [];
    while (!state.done) {
      const stateTensor = Trainer.getTensorFromState(state);
      const [
        nnAction,
        chosenAction,
      ] = Trainer.getOnPolicyAction(model, stateTensor, explore);
      rollout.push([stateTensor, nnAction, chosenAction]);
      state = CartPoleEngine.step(chosenAction, state);
    }
    return Trainer.calculateRewards(rollout);
  }

  static getOnPolicyAction(model, stateTensor, explore) {
    const predict = model.predict(stateTensor);
    const leftProbability = predict.arraySync()[0][0];
    const nnAction = leftProbability > 0.5 ? 0 : 1;
    const chosenAction = Math.random() <= leftProbability ? 0 : 1;
    return [nnAction, explore ? chosenAction : nnAction];
  }

  static calculateRewards(rollout) {
    rollout.reverse();
    let currReward = 0;
    const enhancedRollout = [];
    const allRewards = [];
    rollout.forEach(([state, nnAction, chosenAction]) => {
      currReward = 1 + (REWARD_DISCOUNT * currReward);
      enhancedRollout.push([state, nnAction, chosenAction, currReward]);
      allRewards.push(currReward);
    });
    enhancedRollout.reverse();

    // normalize reward
    const moments = tf.moments(allRewards);
    const mean = moments.mean.arraySync();
    const stdDev = Math.sqrt(moments.variance.arraySync());
    return enhancedRollout.map(([state, nnAction, chosenAction, reward]) => {
      const normedReward = (reward - mean) / stdDev;
      return [state, nnAction, chosenAction, normedReward];
    });
  }

  static trainModel(model, rollouts, iteration) {
    const stateFn = (roll) => roll[0].arraySync()[0];
    const states = rollouts.map((rollout) => rollout.map(stateFn)).flat();
    const rewardFn = (roll) => {
      const nnAction = roll[1];
      const chosenAction = roll[2];
      const reward = roll[3];
      if (reward > 0) {
        if (nnAction === chosenAction) {
          return nnAction;
        }
        return chosenAction;
      }
      if (nnAction === chosenAction) {
        return nnAction ? 0 : 1;
      }
      return nnAction;
    };
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
