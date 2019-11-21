import React, { useState } from 'react';
import CartpoleEngine from './CartpoleEngine';
import CartpoleContainer from './CartpoleContainer';
import styles from '../styles/cartpole.module';

function CartpoleRenderer() {
  const cartpole = new CartpoleEngine();
  const initFn = () => CartpoleEngine.getRandomInitValue();
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
      <h1 className={styles.redText}>Cartpole</h1>
      <CartpoleContainer x={x} xDot={xDot} theta={theta} thetaDot={thetaDot} />
      <ul>
        <li><b>Reward:</b><span>{reward}</span></li>
        <li><b>Done:</b><span>{done ? 'Yes' : 'No'}</span></li>
        <li><b>X:</b><span>{x}</span></li>
        <li><b>Xdot:</b><span>{xDot}</span></li>
        <li><b>theta:</b><span>{theta}</span></li>
        <li><b>thetaDot:</b><span>{thetaDot}</span></li>
      </ul>
      <button onClick={stepLeft}>Left</button>
      <button onClick={stepRight}>Right</button>
      <button onClick={resetFn}>Reset</button>
    </div>
  );
}

export default CartpoleRenderer;
