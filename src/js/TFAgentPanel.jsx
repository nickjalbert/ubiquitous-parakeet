import React from 'react';
import * as tf from '@tensorflow/tfjs';
import CartPoleEngine from './CartPoleEngine';

import styles from '../styles/cartpole.module';

const TRAINING_EPOCHS = 200;
const ROLLOUTS_PER_EPOCH = 5;
const REWARD_DISCOUNT = 0.9;

class Trainer {
  static doTraining() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [4], units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' }),
      ],
    });
    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy' });
    Trainer.doTrainingEpochs(model, 0);
  }

  static doTrainingEpochs(model, epochNum) {
    if (epochNum >= TRAINING_EPOCHS) {
      console.log(`Training finished at epochNum ${epochNum}`);
      return;
    }
    Trainer.evaluateModel(model, epochNum);
    console.log(`Running epoch ${epochNum}`);
    const rollouts = Trainer.getRollouts(ROLLOUTS_PER_EPOCH, model, true);
    Trainer.trainModel(model, rollouts, epochNum);
  }

  static evaluateModel(model, epochNum) {
    const rollouts = Trainer.getRollouts(ROLLOUTS_PER_EPOCH, model, false);
    console.log(rollouts);
    const actions = rollouts.reduce((a, b) => a + b.length, 0);
    const avgR = actions / rollouts.length;
    console.log(`Rollouts from epoch ${epochNum}: ${avgR} avg reward`);
  }

  static getRollouts(count, model, explore) {
    const getRolloutFn = () => Trainer.getRollout(model, explore);
    const rollouts = Array(count).fill().map(getRolloutFn);
    return Trainer.normalizeRewards(rollouts);
  }

  static getRollout(model, explore) {
    let state = CartPoleEngine.getInitialState();
    const rollout = [];
    while (!state.done) {
      const stateTensor = Trainer.getTensorFromState(state);
      const action = Trainer.getOnPolicyAction(model, stateTensor, explore);
      rollout.push([stateTensor, action]);
      state = CartPoleEngine.step(action, state);
    }
    return rollout;
  }

  static getOnPolicyAction(model, stateTensor, explore) {
    const predict = model.predict(stateTensor);
    const leftProbability = predict.arraySync()[0][0];
    if (!explore ) {
      //console.log(leftProbability);
    }
    const nnAction = leftProbability > 0.5 ? 0 : 1;
    const chosenAction = Math.random() <= leftProbability ? 0 : 1;
    return explore ? chosenAction : nnAction;
  }

  static normalizeRewards(rollouts) {
    const allRewards = [];
    const rewardedRollouts = rollouts.map((rollout) => {
      rollout.reverse();
      let currReward = 0;
      const rewardedRollout = rollout.map(([state, action]) => {
        currReward = 1 + (REWARD_DISCOUNT * currReward);
        allRewards.push(currReward);
        return [state, action, currReward];
      });
      rewardedRollout.reverse()
      return rewardedRollout;
    });

    // normalize reward
    const moments = tf.moments(allRewards);
    const mean = moments.mean.arraySync();
    const stdDev = Math.sqrt(moments.variance.arraySync());
    return rewardedRollouts.map((rollout) => {
      return rollout.map(([state, action, reward]) => {
        const normedReward = (reward - mean) / stdDev;
        return [state, action, normedReward];
      });
    });
  }

  static trainModel(model, rollouts, epochNum) {
    const stateFn = (roll) => roll[0].arraySync()[0];
    const states = rollouts.map((rollout) => rollout.map(stateFn)).flat();
    const rewardFn = (roll) => {
      const action = roll[1];
      const reward = roll[2];
      if (reward > 0 && action === 0) {
        return 1;
      }
      if (reward > 0 && action === 1) {
        return 0;
      }
      if (reward <= 0 && action === 0) {
        return 0;
      }
      if (reward <= 0 && action === 1) {
        return 1;
      }
      /*
      if (reward > 0) {
        // console.log(`returning good ${action} with reward ${reward}`);
        return action;
      }
      const negatedAction = action ? 0 : 1;
      // console.log(`returning ${negatedAction}, was ${action} with reward ${reward}`);
      return negatedAction
      */
    }
    const rewards = rollouts.map((rollout) => rollout.map(rewardFn)).flat();
    const trainTensor = tf.tensor(states, [states.length, 4]);
    const trainResults = tf.tensor(rewards, [rewards.length, 1]);
    model.fit(trainTensor, trainResults).then(
      () => Trainer.doTrainingEpochs(model, epochNum + 1),
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
