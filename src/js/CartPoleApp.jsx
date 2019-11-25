import React, { useState, useEffect } from 'react';

import * as tf from '@tensorflow/tfjs';


import CartPoleEngine from './CartPoleEngine';
import CartPoleVisualizer from './CartPoleVisualizer';

import styles from '../styles/cartpole.module';

const OPEN_AI_IMPL_URL = [
  'https://github.com/openai/gym/blob/',
  'master/gym/envs/classic_control/cartpole.py',
].join('');

const LEFT = 0;
const RIGHT = 1;
const RUN_INTERVAL = 200;

function getKeyboardBindingFn(stepLeft, stepRight) {
  const keyUpHandler = ({ key }) => {
    if (key === 'ArrowRight') {
      stepRight();
    }
    if (key === 'ArrowLeft') {
      stepLeft();
    }
  };
  return () => {
    window.addEventListener('keyup', keyUpHandler);
    return () => window.removeEventListener('keyup', keyUpHandler);
  };
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

function autoRunStep(currState, setSimState) {
  const action = (Math.random() >= 0.5 ? LEFT : RIGHT);
  const newState = CartPoleEngine.step(action, currState);
  setSimState(newState);
  if (!newState.done) {
    setTimeout(() => autoRunStep(newState, setSimState), RUN_INTERVAL);
  }
}

function CartPoleApp() {
  const [simState, setSimState] = useState(CartPoleEngine.getInitialState());

  const stepLeft = () => setSimState(CartPoleEngine.step(LEFT, simState));
  const stepRight = () => setSimState(CartPoleEngine.step(RIGHT, simState));
  const resetFn = () => setSimState(CartPoleEngine.getInitialState());
  const stepRandom = () => (Math.random() >= 0.5 ? stepLeft() : stepRight());
  const randomAgent = () => {
    setTimeout(() => autoRunStep(simState, setSimState), RUN_INTERVAL);
  };
  useEffect(getKeyboardBindingFn(stepLeft, stepRight));

  return (
    <div className={styles.cartpoleApp}>
      <h1 className={styles.titleText}>Cartpole</h1>
      <CartPoleVisualizer simState={simState} />
      <div className={styles.instructions}>
        Try to balance the pole manually using the buttons below or
        the arrow keys to push the cart.
      </div>

      <div className={styles.instruments}>
          <span className={styles.instruments__cart_position}>
            <span className={styles.instruments__label}>
              Cart position:
            </span>
            <span className={styles.instruments__value}>
              {simState.x.toFixed(2)}
            </span>
          </span>

          <span className={styles.instruments__cart_speed}>
            <span className={styles.instruments__label}>
              Cart speed:
            </span>
            <span className={styles.instruments__value}>
              {simState.xDot.toFixed(2)}
            </span>
          </span>

          <span className={styles.instruments__pole_angle}>
            <span className={styles.instruments__label}>
              Pole angle:
            </span>
            <span className={styles.instruments__value}>
              {(simState.theta * (180 / Math.PI)).toFixed(2)}
            </span>
          </span>

          <span className={styles.instruments__pole_speed}>
            <span className={styles.instruments__label}>
              Pole speed:
            </span>
            <span className={styles.instruments__value}>
              {simState.thetaDot.toFixed(2)}
            </span>
          </span>
      </div>

      <div className={styles.controls__panel}>
        <button className={styles.controls__button} onClick={stepLeft}>
          Push cart left
        </button>
        <button className={styles.controls__button} onClick={resetFn}>
          Reset cart
        </button>
        <button className={styles.controls__button} onClick={stepRight}>
          Push cart right
        </button>
      </div>
      <div className={styles.divider}>&nbsp;</div>
       <div className={styles.controls__panel}>
        <button className={styles.controls__button} onClick={stepRandom}>
          Random Step
        </button>
        <button className={styles.controls__button} onClick={randomAgent}>
          Random Agent
        </button>
        <button className={styles.controls__button} onClick={doTensorFlow}>
          Do TensorFlow
        </button>
      </div>
      <div className={styles.divider}>&nbsp;</div>
      <div className={styles.description}>
        Cartpole is a classic reinforcement learning benchmark.
        <ul className={styles.description__list}>
          <li>
            A cart sits on a frictionless track with a pole balanced on top
            of it.
          </li>
          <li>
            The goal is to balance the pole on the cart by pushing the cart
            left or right.
          </li>
          <li>
            The pole is initialized with a small random tilt.
          </li>
          <li>
            Each push adds 1 to the score and a score of 200+ is a win.
          </li>
          <li>
            Game over if the cart is more than 2.4 units from the
            center or if pole tilt is more than 12 degrees.
          </li>
        </ul>
        Ported from &nbsp;
        <a className={styles.link}
          target='_blank'
          rel="noopener noreferrer"
          href={OPEN_AI_IMPL_URL}
        >
          OpenAI&apos;s cartpole implementation
        </a>.
      </div>
    </div>
  );
}

export default CartPoleApp;
