import React from 'react';

import styles from '../styles/cartpole.module';


const OPEN_AI_IMPL_URL = [
  'https://github.com/openai/gym/blob/',
  'master/gym/envs/classic_control/cartpole.py',
].join('');
const GITHUB_URL = 'https://github.com/nickjalbert/ubiquitous-parakeet';


function InfoPanel() {
  return (
    <div className={styles.description}>
      <p>
        Cartpole is a classic reinforcement learning benchmark.
      </p>
      <ul className={styles.description__list}>
        <li>
          A cart sits on a frictionless track with a pole balanced on top
          of it.
        </li>
        <li>
          The goal is to balance the pole on the cart by pushing the cart
          left or right.
        </li>
        <li>
          The pole is initialized with a small random tilt.
        </li>
        <li>
          Each push adds 1 to the score and a score of 200+ is a win.
        </li>
        <li>
          Game over if the cart is more than 2.4 units from the
          center or if pole tilt is more than 12 degrees.
        </li>
      </ul>
      <p>
        Ported from &nbsp;
        <a className={styles.link}
          target='_blank'
          rel="noopener noreferrer"
          href={OPEN_AI_IMPL_URL}
        >
          OpenAI&apos;s cartpole implementation
        </a>.
      </p>
      <p>
        See the source on&nbsp;
        <a className={styles.link}
          target='_blank'
          rel="noopener noreferrer"
          href={GITHUB_URL}
        >
          GitHub
        </a>.
      </p>
    </div>
  );
}

InfoPanel.propTypes = { };

export default InfoPanel;
