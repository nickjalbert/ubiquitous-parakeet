// Ported from:
// https://github.com/openai/gym/blob/master/gym/envs/classic_control/cartpole.py

class Cartpole {
  constructor(name) {
    this.name = name;
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
    this.reset();
  }

  step(action) {
    if (action !== 1 && action !== 0) {
      throw new Error(`Invalid action: ${action}, Choose 0 or 1`);
    }
    const {
      x, xDot, theta, thetaDot,
    } = this.state;
    const force = action === 1 ? this.forceMag : (-1 * this.forceMag);
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const temp = (force + (this.poleMassLength * thetaDot * thetaDot * sinTheta)) / this.totalMass;
    const numerator = (this.gravity * sinTheta) - (cosTheta * temp);
    const poleMassCosThetaSquared = this.poleMass * cosTheta * cosTheta;
    const denominator = this.length * ((4.0 / 3.0) - (poleMassCosThetaSquared / this.totalMass));
    const thetaAccel = numerator / denominator;
    const xAccel = temp - (this.poleMassLength * thetaAccel * cosTheta) / this.totalMass;

    // Euler kinematics integrator
    this.state = {
      x: x + this.tau * xDot,
      xDot: xDot + this.tau * xAccel,
      theta: theta + this.tau * thetaDot,
      thetaDot: thetaDot + this.tau * thetaAccel,
    };

    const done = (
      this.state.x < (-1 * this.xThreshold)
      || this.state.x > this.xThreshold
      || this.state.theta < (-1 * this.thetaThresholdRadians)
      || this.state.theta > this.thetaThresholdRadians
    );
    const reward = done ? 0 : 1;
    return {
      reward,
      done,
      ...this.state,
    };
  }

  reset() {
    const randomInit = () => ((Math.random() * 0.1) - 0.05);
    this.state = {
      x: randomInit(),
      xDot: randomInit(),
      theta: randomInit(),
      thetaDot: randomInit(),
    };
  }

  getName() {
    return this.name;
  }
}

export default Cartpole;
