import React from 'react';
import PropTypes from 'prop-types';
import { calculateLeftPx } from './Utility';
import styles from '../styles/cartpole.module';

function Pole(props) {
  const poleWidth = 10;
  const poleAngle = props.theta * (180 / Math.PI);
  // Adding pole angle below is a hack to make it animate more naturally
  const poleLeft = calculateLeftPx(props.x, poleWidth) + poleAngle;
  const poleStyle = {
    left: poleLeft,
    transform: `rotate(${poleAngle}deg)`,
  };

  return (
    <div className={styles.pole} style={poleStyle} />
  );
}

Pole.propTypes = {
  x: PropTypes.number.isRequired,
  theta: PropTypes.number.isRequired,
};

export default Pole;
