import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/cartpole.module';

function Pole(props) {
  return (
    <div className={styles.pole}>
      This is a pole at {props.theta} degrees
      with a cart at {props.x}
    </div>
  );
}

Pole.propTypes = {
  x: PropTypes.number,
  theta: PropTypes.number,
};

export default Pole;
