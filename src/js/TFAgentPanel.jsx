import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/cartpole.module';

function TFAgentPanel(props) {
  return (
    <div className={styles.controls__panel}>
      <button className={styles.controls__button} onClick={props.doTensorFlow}>
        Do TensorFlow
      </button>
    </div>
  );
}

TFAgentPanel.propTypes = {
  doTensorFlow: PropTypes.func.isRequired,
};

export default TFAgentPanel;
