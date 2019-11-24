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
      <Scoreboard reward={props.reward} />
      <ResultAlert done={props.done} />
      <Pole x={props.x} theta={props.theta} />
      <Cart x={props.x} />
    </div>
  );
}

CartPoleVisualizer.propTypes = {
  reward: PropTypes.number.isRequired,
  done: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  theta: PropTypes.number.isRequired,
};

export default CartPoleVisualizer;
