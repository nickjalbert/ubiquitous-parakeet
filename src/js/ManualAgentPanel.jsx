import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/cartpole.module';

function ManualAgentPanel(props) {
  return (
    <div>
      <div className={styles.instructions}>
        Balance the pole using the buttons or
        your keyboard&apos;s arrow keys to push the cart.
      </div>

      <div className={styles.controls__panel}>
        <button className={styles.controls__button} onClick={props.stepLeft}>
          Push cart left
        </button>
        <button className={styles.controls__button} onClick={props.resetFn}>
          Reset cart
        </button>
        <button className={styles.controls__button} onClick={props.stepRight}>
          Push cart right
        </button>
      </div>
    </div>
  );
}

ManualAgentPanel.propTypes = {
  stepLeft: PropTypes.func.isRequired,
  resetFn: PropTypes.func.isRequired,
  stepRight: PropTypes.func.isRequired,
};

export default ManualAgentPanel;
