import React from 'react';
import PropTypes from 'prop-types';
import Scoreboard from './Scoreboard';
import ResultAlert from './ResultAlert';
import Pole from './Pole';
import Cart from './Cart';
import styles from '../styles/cartpole.module';

function CartPoleVisualizer(props) {
  return (
    <div className={styles.cartpoleVisualizer}>
      <Scoreboard reward={props.simState.totalReward} />
      <ResultAlert done={props.simState.done} />
      <Pole x={props.simState.x} theta={props.simState.theta} />
      <Cart x={props.simState.x} />
    </div>
  );
}

CartPoleVisualizer.propTypes = {
  simState: PropTypes.object.isRequired,
};

export default CartPoleVisualizer;
