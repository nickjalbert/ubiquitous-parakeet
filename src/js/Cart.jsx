import React from 'react';
import PropTypes from 'prop-types';
import calculateLeftPx from './Utility';
import styles from '../styles/cartpole.module';

function Cart(props) {
  const cartWidth = 100;
  const cartStyle = {
    left: calculateLeftPx(props.x, cartWidth),
  };
  return (
    <div className={styles.cart} style={cartStyle} />
  );
}

Cart.propTypes = {
  x: PropTypes.number,
};

export default Cart;
