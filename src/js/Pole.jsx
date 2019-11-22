import React from 'react';
import PropTypes from 'prop-types';
import calculateLeftPx from './Utility';
import styles from '../styles/cartpole.module';

function Pole(props) {
  const poleWidth = 10;
  const poleStyle = {
    left: calculateLeftPx(props.x, poleWidth),
  };

  return (
    <div className={styles.pole} style={poleStyle} />
  );
}

Pole.propTypes = {
  x: PropTypes.number,
  theta: PropTypes.number,
};

export default Pole;
