// Ported from:
// https://github.com/openai/gym/blob/master/gym/envs/classic_control/cartpole.py

class CartPoleEngine {
  constructor() {
    this.gravity = 9.8;
    this.masscart = 1.0;
    this.poleMass = 0.1;
    this.totalMass = (this.poleMass + this.masscart);
    // actually half the pole's length
    this.length = 0.5;
    this.poleMassLength = (this.poleMass * this.length);
    this.forceMag = 10.0;
    // seconds between state updates
    this.tau = 0.02;
    // Angle at which to fail the episode
    this.thetaThresholdRadians = (12 * 2 * Math.PI) / 360;
    this.xThreshold = 2.4;
  }

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

  step(action, state) {
    if (action !== 0 && action !== 1) {
      throw new Error(`Invalid action: ${action}, Choose 0 or 1`);
    }
    const {
      totalReward, done, x, xDot, theta, thetaDot,
    } = state;
    const force = action === 1 ? this.forceMag : (-1 * this.forceMag);
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const temp = (force + (this.poleMassLength * thetaDot * thetaDot * sinTheta)) / this.totalMass;
    const numerator = (this.gravity * sinTheta) - (cosTheta * temp);
    const poleMassCosThetaSquared = this.poleMass * cosTheta * cosTheta;
    const denominator = this.length * ((4.0 / 3.0) - (poleMassCosThetaSquared / this.totalMass));
    const thetaAccel = numerator / denominator;
    const xAccel = temp - (this.poleMassLength * thetaAccel * cosTheta) / this.totalMass;

    const newX = x + this.tau * xDot;
    const newXDot = xDot + this.tau * xAccel;
    const newTheta = theta + this.tau * thetaDot;
    const newThetaDot = thetaDot + this.tau * thetaAccel;

    const newDone = (
      newX < (-1 * this.xThreshold)
      || newX > this.xThreshold
      || newTheta < (-1 * this.thetaThresholdRadians)
      || newTheta > this.thetaThresholdRadians
      || done
    );
    const newStepReward = newDone ? 0 : 1;
    const newTotalReward = totalReward + newStepReward;
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
