import React from 'react';
import PropTypes from 'prop-types';
import Pole from './Pole';
import Cart from './Cart';
import styles from '../styles/cartpole.module';

function CartPoleContainer(props) {
  return (
    <div className={styles.cartpoleContainer}>
      <Pole x={props.x} theta={props.theta} />
      <Cart x={props.x} />
    </div>
  );
}

CartPoleContainer.propTypes = {
  x: PropTypes.number,
  theta: PropTypes.number,
};

export default CartPoleContainer;
