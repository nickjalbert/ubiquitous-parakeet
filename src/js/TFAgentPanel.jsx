import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as tf from '@tensorflow/tfjs';
import CartPoleEngine from './CartPoleEngine';

import styles from '../styles/cartpole.module';

const SRC_URL = [
  'https://github.com/nickjalbert/ubiquitous-parakeet/',
  'blob/master/src/js/TFAgentPanel.jsx',
].join('');

const REWARD_DISCOUNT = 0.9;

class Trainer {
  static getModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [4], units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' }),
      ],
    });
    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy' });
    model.epochsTrained = 0;
    return model;
  }

  static doTraining(
    model,
    epochs,
    rollouts,
    setAvgReward,
    setEpochsTrained,
    finishedCallback,
  ) {
    Trainer.epochs = epochs;
    Trainer.rollouts = rollouts;
    Trainer.setAvgReward = setAvgReward;
    Trainer.setEpochsTrained = setEpochsTrained;
    Trainer.finishedCallback = finishedCallback;
    Trainer.doTrainingEpochs(model, 0);
  }

  static doTrainingEpochs(model, epochNum) {
    Trainer.evaluateModel(model);
    if (epochNum >= Trainer.epochs) {
      if (Trainer.finishedCallback) {
        Trainer.finishedCallback();
      }
      return;
    }
    const rollouts = Trainer.getRollouts(Trainer.rollouts, model, true);
    Trainer.trainModel(model, rollouts, epochNum);
  }

  static evaluateModel(model) {
    const rollouts = Trainer.getRollouts(Trainer.rollouts, model, false);
    const actions = rollouts.reduce((a, b) => a + b.length, 0);
    const avgReward = actions / rollouts.length;
    Trainer.setAvgReward(avgReward);
    Trainer.setEpochsTrained(model.epochsTrained);
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
      rewardedRollout.reverse();
      return rewardedRollout;
    });

    const moments = tf.moments(allRewards);
    const mean = moments.mean.arraySync();
    const stdDev = Math.sqrt(moments.variance.arraySync());
    return rewardedRollouts.map((rollout) => {
      const normalized = rollout.map(([state, action, reward]) => {
        const normedReward = (reward - mean) / stdDev;
        return [state, action, normedReward];
      });
      return normalized;
    });
  }

  static trainModel(model, rollouts, epochNum) {
    const stateFn = (roll) => roll[0].arraySync()[0];
    const states = rollouts.map((rollout) => rollout.map(stateFn)).flat();
    // NB - NN outputs "probability of going left"; exercise care with labels
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
      throw new Error(`Unexpected reward: ${action} ${reward}`);
    };
    const rewards = rollouts.map((rollout) => rollout.map(rewardFn)).flat();
    const trainTensor = tf.tensor(states, [states.length, 4]);
    const trainResults = tf.tensor(rewards, [rewards.length, 1]);
    // TODO - something nicer than tracking on the model
    // eslint-disable-next-line no-param-reassign
    model.epochsTrained += 1;
    model.fit(trainTensor, trainResults).then(
      () => Trainer.doTrainingEpochs(model, epochNum + 1),
    );
  }

  static getTensorFromState(state) {
    const stateArr = [state.x, state.xDot, state.theta, state.thetaDot];
    return tf.tensor(stateArr, [1, 4]);
  }

  static returnStatePrediction(model, state) {
    const stateTensor = Trainer.getTensorFromState(state);
    return Trainer.getOnPolicyAction(model, stateTensor, false);
  }
}


function TFAgentPanel(props) {
  const [tfAgent, setTFAgent] = useState(Trainer.getModel());
  const [epochs, setEpochs] = useState(5);
  const [rollouts, setRollouts] = useState(5);
  const [avgReward, setAvgReward] = useState(0);
  const [epochsTrained, setEpochsTrained] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const finishedCallback = () => setIsTraining(false);
  const train = () => {
    setIsTraining(true);
    setTimeout(() => {
      Trainer.doTraining(
        tfAgent,
        epochs,
        rollouts,
        setAvgReward,
        setEpochsTrained,
        finishedCallback,
      );
    }, 250);
  };
  const reset = () => {
    setTFAgent(Trainer.getModel());
    setAvgReward(0);
    setEpochsTrained(0);
  };
  const onEpochsChange = (evt) => setEpochs(evt.target.value);
  const onRolloutsChange = (evt) => setRollouts(evt.target.value);

  return (
    <div>
      <div className={styles.trainingInfo}>
        <div>Epochs trained: {epochsTrained}</div>
        <div>Avg reward: {avgReward}</div>
      </div>
      <div className={styles.controls__panel}>
        {isTraining && <div className={styles.disableDiv} />}
        <div className={styles.controls__training}>
          <label>
            Epochs:
            <input value={epochs} onChange={onEpochsChange} />
          </label>
          <label>
            Rolls per Epoch:
            <input value={rollouts} onChange={onRolloutsChange} />
          </label>
          <button className={styles.controls__button} onClick={train}>
            Train agent
          </button>
        </div>
        <button className={styles.controls__button} onClick={reset}>
          Reset agent
        </button>
        <button className={styles.controls__button} onClick={() => props.runTFAgent(tfAgent)}>
          Run agent
        </button>
      </div>
      <div className={styles.descriptionBox}>
        <div className={styles.description}>
          <p>
            Here you can use TensorFlow JS to train a neural net
            to play cartpole.
          </p>
          <ul className={styles.description__list}>
            <li>
              The neural net takes in a Cartpole state and returns an
              action.
            </li>
            <li>
              It has an input layer of 16 ReLU units, then a hidden layer
              of 8 ReLU units, and finally an output sigmoid node. Every 
              layer is densely connected.
            </li>
            <li>
              The net learns by playing Cartpole
              (a &quot;rollout&quot;). Each epoch
              contains a user-chosen number of rollouts.  The net is trained
              such that actions in rollouts associated with a higher scores
              are encouraged.
            </li>
            <li>
              Training progress depends on a lot of randomness.  In general,
              you should see improved play after a couple hundred rollouts
              (e.g. 50 epochs of 5 rollouts each).
            </li>
            <li>
              Check out the source&nbsp;
              <a
                className={styles.link}
                target='_blank'
                rel="noopener noreferrer"
                href={SRC_URL}
              >
                here
              </a>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

TFAgentPanel.propTypes = {
  runTFAgent: PropTypes.func.isRequired,
};

export { Trainer };
export default TFAgentPanel;
