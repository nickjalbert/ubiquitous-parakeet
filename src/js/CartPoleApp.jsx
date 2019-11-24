import React, { useState, useEffect } from 'react';

import CartPoleEngine from './CartPoleEngine';
import CartPoleVisualizer from './CartPoleVisualizer';

import styles from '../styles/cartpole.module';

const OPEN_AI_IMPL_URL = [
  'https://github.com/openai/gym/blob/',
  'master/gym/envs/classic_control/cartpole.py',
].join('');


function CartPoleApp() {
  const cartpole = new CartPoleEngine();
  const initFn = () => CartPoleEngine.getRandomInitValue();
  const [x, setX] = useState(initFn);
  const [xDot, setXDot] = useState(initFn);
  const [theta, setTheta] = useState(initFn);
  const [thetaDot, setThetaDot] = useState(initFn);
  const [done, setDone] = useState(false);
  const [reward, setReward] = useState(0);

  const stepFn = (action) => {
    const {
      stepReward,
      stepDone,
      newX,
      newXDot,
      newTheta,
      newThetaDot,
    } = cartpole.step(action, x, xDot, theta, thetaDot);
    setReward(done ? reward : reward + stepReward); // no scoring after done
    setDone(done || stepDone); // So we don't get undone
    setX(newX);
    setXDot(newXDot);
    setTheta(newTheta);
    setThetaDot(newThetaDot);
  };

  const stepLeft = () => { stepFn(0); };
  const stepRight = () => { stepFn(1); };
  const resetFn = () => {
    setReward(0);
    setDone(false);
    setX(initFn());
    setXDot(initFn());
    setTheta(initFn());
    setThetaDot(initFn());
  };

  const doRandomAction = () => {
    stepFn(Math.random() >= 0.5 ? 0 : 1);
  };

  // Set keyboard bindings
  const keyUpHandler = ({ key }) => {
    if (key === 'ArrowRight') {
      stepRight();
    }
    if (key === 'ArrowLeft') {
      stepLeft();
    }
  };
  useEffect(() => {
    window.addEventListener('keyup', keyUpHandler);
    return () => {
      window.removeEventListener('keyup', keyUpHandler);
    };
  });

  return (
    <div className={styles.cartpoleApp}>
      <h1 className={styles.titleText}>Cartpole</h1>
      <CartPoleVisualizer reward={reward} done={done} x={x} theta={theta} />
      <div className={styles.instructions}>
        Try to balance the pole manually using the buttons below or
        the arrow keys to push the cart.
      </div>

      <div className={styles.instruments}>
        <span className={styles.instruments__container}>

          <span className={styles.instruments__cart_position}>
            <span className={styles.instruments__label}>
              Cart position:
            </span>
            <span className={styles.instruments__value}>
              {x.toFixed(2)}
            </span>
          </span>

          <span className={styles.instruments__cart_speed}>
            <span className={styles.instruments__label}>
              Cart speed:
            </span>
            <span className={styles.instruments__value}>
              {xDot.toFixed(2)}
            </span>
          </span>

          <span className={styles.instruments__pole_angle}>
            <span className={styles.instruments__label}>
              Pole angle:
            </span>
            <span className={styles.instruments__value}>
              {(theta * (180 / Math.PI)).toFixed(2)}
            </span>
          </span>

          <span className={styles.instruments__pole_speed}>
            <span className={styles.instruments__label}>
              Pole speed:
            </span>
            <span className={styles.instruments__value}>
              {thetaDot.toFixed(2)}
            </span>
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
        <button className={styles.controls__button} onClick={doRandomAction}>
          Random Agent
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
