import React from 'react';
import ReactDOM from 'react-dom';
import Cartpole from './cartpole';
import styles from '../styles/index.module';
import '../styles/global';

function initPage() {
  const cartpole = new Cartpole('Test');
  const element = document.createElement('div');
  const jsxTest = <h2 className={styles.redText}>Hello React {cartpole.getName()}</h2>;
  document.body.appendChild(element);
  ReactDOM.render(jsxTest, element);
}

// http://youmightnotneedjquery.com/#ready
function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(initPage);
