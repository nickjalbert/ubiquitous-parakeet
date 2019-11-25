import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/cartpole.module';

function RandomAgentPanel(props) {
  return (
    <div className={styles.controls__panel}>
      <button className={styles.controls__button} onClick={props.stepRandom}>
        Random Step
      </button>
      <button className={styles.controls__button} onClick={props.resetFn}>
        Reset Cart
      </button>
      <button className={styles.controls__button} onClick={props.randomAgent}>
        Random Agent
      </button>
    </div>
  );
}

RandomAgentPanel.propTypes = {
  stepRandom: PropTypes.func.isRequired,
  resetFn: PropTypes.func.isRequired,
  randomAgent: PropTypes.func.isRequired,
};

export default RandomAgentPanel;
