import _ from 'lodash';
import Cartpole from './cartpole';
import styles from './index.module';
import './global';

function component() {
  const cartpole = new Cartpole('Test');
  const element = document.createElement('div');
  element.classList.add(styles.redText);

  element.innerHTML = _.join(['Hello', 'webpack', cartpole.getName()], ' ');

  return element;
}

document.body.appendChild(component());
