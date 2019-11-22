import React, { useState } from 'react';
import CartPoleEngine from './CartPoleEngine';
import CartPoleContainer from './CartPoleContainer';
import styles from '../styles/cartpole.module';

function CartPoleRenderer() {
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
    setReward(reward + stepReward);
    setDone(stepDone);
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

  return (
    <div className={styles.cartpoleRenderer}>
      <h1 className={styles.titleText}>Cartpole</h1>
      <CartPoleContainer reward={reward} done={done} x={x} theta={theta} />
      <ul>
        <li><b>Reward:</b><span>{reward}</span></li>
        <li><b>Done:</b><span>{done ? 'Yes' : 'No'}</span></li>
        <li><b>X:</b><span>{x}</span></li>
        <li><b>Xdot:</b><span>{xDot}</span></li>
        <li><b>theta:</b><span>{theta}</span></li>
        <li><b>pole angle:</b><span>{theta * (180 / Math.PI)}</span></li>
        <li><b>thetaDot:</b><span>{thetaDot}</span></li>
      </ul>
      <button onClick={stepLeft}>Left</button>
      <button onClick={stepRight}>Right</button>
      <button onClick={resetFn}>Reset</button>
    </div>
  );
}

export default CartPoleRenderer;
