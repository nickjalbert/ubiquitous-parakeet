import React, { useState } from 'react';
import Cartpole from './Cartpole';
import styles from '../styles/cartpole.module';

function CartpoleRenderer() {
  const cartpole = useState(() => new Cartpole('ReactTest'))[0];
  return (
    <div className={styles.cartpoleContainer}>
      <h1 className={styles.redText}>
        { cartpole.getName() }
      </h1>
    </div>
  );
}

export default CartpoleRenderer;
