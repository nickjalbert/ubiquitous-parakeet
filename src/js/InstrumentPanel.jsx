import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/cartpole.module';

function InstrumentPanel(props) {
  return (
    <div>
      <div className={styles.instruments}>
        <span className={styles.instruments__cart_position}>
          <span className={styles.instruments__label}>
            Cart position:
          </span>
          <span className={styles.instruments__value}>
            {props.simState.x.toFixed(2)}
          </span>
        </span>

        <span className={styles.instruments__cart_speed}>
          <span className={styles.instruments__label}>
            Cart speed:
          </span>
          <span className={styles.instruments__value}>
            {props.simState.xDot.toFixed(2)}
          </span>
        </span>

        <span className={styles.instruments__pole_angle}>
          <span className={styles.instruments__label}>
            Pole angle:
          </span>
          <span className={styles.instruments__value}>
            {(props.simState.theta * (180 / Math.PI)).toFixed(2)}
          </span>
        </span>

        <span className={styles.instruments__pole_speed}>
          <span className={styles.instruments__label}>
            Pole speed:
          </span>
          <span className={styles.instruments__value}>
            {props.simState.thetaDot.toFixed(2)}
          </span>
        </span>
      </div>
    </div>
  );
}

InstrumentPanel.propTypes = {
  simState: PropTypes.object.isRequired,
};

export default InstrumentPanel;
