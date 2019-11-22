import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/cartpole.module';

function Scoreboard(props) {
  return (
    <div className={styles.scoreboard}>
      Score: {props.reward}
    </div>
  );
}

Scoreboard.propTypes = {
  reward: PropTypes.number.isRequired,
};

export default Scoreboard;
