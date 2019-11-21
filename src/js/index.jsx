import React from 'react';
import ReactDOM from 'react-dom';
import Cartpole from './cartpole';
import styles from '../styles/index.module';
import '../styles/global';

function component() {
  const cartpole = new Cartpole('Test');
  const element = document.createElement('div');
  element.classList.add(styles.redText);
  const jsxTest = <h2 className={styles.redText}>Hello React {cartpole.getName()}</h2>;
  ReactDOM.render(jsxTest, element);
  return element;
}

document.body.appendChild(component());
