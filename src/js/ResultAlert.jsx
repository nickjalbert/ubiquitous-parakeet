import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/cartpole.module';

function ResultAlert(props) {
  if (!props.done) {
    return null;
  }
  return (
    <div className={styles.resultAlert}>
      Game Over!
    </div>
  );
}

ResultAlert.propTypes = {
  done: PropTypes.bool.isRequired,
};

export default ResultAlert;
