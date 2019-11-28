// Ported from:
// https://github.com/openai/gym/blob/master/gym/envs/classic_control/cartpole.py

class CartPoleEngine {
  static getInitialState() {
    return {
      totalReward: 0,
      stepReward: 0,
      done: false,
      x: CartPoleEngine.getRandomInitValue(),
      xDot: CartPoleEngine.getRandomInitValue(),
      theta: CartPoleEngine.getRandomInitValue(),
      thetaDot: CartPoleEngine.getRandomInitValue(),
    };
  }

  static step(action, state) {
    // Define constants
    const GRAVITY = 9.8;
    const CART_MASS = 1.0;
    const POLE_MASS = 0.1;
    const TOTAL_MASS = (POLE_MASS + CART_MASS);
    const POLE_LENGTH = 0.5; // actually half the pole's length
    const POLE_MASS_LENGTH = (POLE_MASS * POLE_LENGTH);
    const FORCE_MAG = 10.0;
    const TAU = 0.02; // seconds between state updates
    const THETA_THRESHOLD_RADIANS = (12 * 2 * Math.PI) / 360;
    const X_THRESHOLD = 2.4;

    if (action !== 0 && action !== 1) {
      throw new Error(`Invalid action: ${action}, Choose 0 or 1`);
    }
    const {
      totalReward, done, x, xDot, theta, thetaDot,
    } = state;
    const force = action === 1 ? FORCE_MAG : (-1 * FORCE_MAG);
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    const pmlThetaDot2Sin = POLE_MASS_LENGTH * thetaDot * thetaDot * sinTheta;
    const temp = (force + pmlThetaDot2Sin) / TOTAL_MASS;
    const numer = (GRAVITY * sinTheta) - (cosTheta * temp);
    const pmCosTheta2 = POLE_MASS * cosTheta * cosTheta;
    const denom = POLE_LENGTH * ((4.0 / 3.0) - (pmCosTheta2 / TOTAL_MASS));
    const thetaAccel = numer / denom;
    const pmlThetaAccelCosTheta = POLE_MASS_LENGTH * thetaAccel * cosTheta;
    const xAccel = temp - (pmlThetaAccelCosTheta / TOTAL_MASS);

    const newX = x + TAU * xDot;
    const newXDot = xDot + TAU * xAccel;
    const newTheta = theta + TAU * thetaDot;
    const newThetaDot = thetaDot + TAU * thetaAccel;

    const newStepReward = newDone ? 0 : 1;
    const newTotalReward = totalReward + newStepReward;

    const newDone = (
      newX < (-1 * X_THRESHOLD)
      || newX > X_THRESHOLD
      || newTheta < (-1 * THETA_THRESHOLD_RADIANS)
      || newTheta > THETA_THRESHOLD_RADIANS
      || newTotalReward > 200
      || done
    );

    return {
      totalReward: newTotalReward,
      stepReward: newStepReward,
      done: newDone,
      x: newX,
      xDot: newXDot,
      theta: newTheta,
      thetaDot: newThetaDot,
    };
  }

  static getRandomInitValue() {
    return (Math.random() * 0.1) - 0.05;
  }
}

export default CartPoleEngine;
