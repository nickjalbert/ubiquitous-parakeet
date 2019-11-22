import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/cartpole.module';

function Cart(props) {
  return (
    <div className={styles.cart}>
      This is a cart at {props.x}
    </div>
  );
}

Cart.propTypes = {
  x: PropTypes.number,
};

export default Cart;
