import _ from 'lodash';
import Cartpole from './cartpole';

function component() {
  const cartpole = new Cartpole('Test');
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack', cartpole.getName()], ' ');

  return element;
}

document.body.appendChild(component());
