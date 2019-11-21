import React from 'react';
import ReactDOM from 'react-dom';
import CartpoleRenderer from './CartpoleRenderer';
import '../styles/global';

function initPage() {
  const element = document.createElement('div');
  document.body.appendChild(element);
  ReactDOM.render(<CartpoleRenderer />, element);
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
