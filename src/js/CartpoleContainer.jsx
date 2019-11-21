import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/cartpole.module';

function CartpoleContainer(props) {
  return (
    <div className={styles.cartpoleContainer}>
      <ul>
        <li><b>X:</b><span>{props.x}</span></li>
        <li><b>Xdot:</b><span>{props.xDot}</span></li>
        <li><b>theta:</b><span>{props.theta}</span></li>
        <li><b>thetaDot:</b><span>{props.thetaDot}</span></li>
      </ul>
    </div>
  );
}

CartpoleContainer.propTypes = {
  x: PropTypes.number,
  xDot: PropTypes.number,
  theta: PropTypes.number,
  thetaDot: PropTypes.number,
};

export default CartpoleContainer;
