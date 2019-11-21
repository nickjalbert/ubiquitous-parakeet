import _ from 'lodash';
import Cartpole from './cartpole';
import styles from '../styles/index.module';
import '../styles/global';

function component() {
  const cartpole = new Cartpole('Test');
  const element = document.createElement('div');
  element.classList.add(styles.redText);

  element.innerHTML = _.join(['Hello', 'webpack', cartpole.getName()], ' ');

  return element;
}

document.body.appendChild(component());
