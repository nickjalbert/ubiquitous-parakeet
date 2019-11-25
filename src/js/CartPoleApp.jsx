import React, { useState, useEffect } from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import * as tf from '@tensorflow/tfjs';


import CartPoleEngine from './CartPoleEngine';
import CartPoleVisualizer from './CartPoleVisualizer';
import InstrumentPanel from './InstrumentPanel';
import ManualAgentPanel from './ManualAgentPanel';
import RandomAgentPanel from './RandomAgentPanel';
import TFAgentPanel from './TFAgentPanel';
import InfoPanel from './InfoPanel';

import 'react-tabs/style/react-tabs.scss';
import styles from '../styles/cartpole.module';


const LEFT = 0;
const RIGHT = 1;
const RUN_INTERVAL = 200;


function getKeyboardBindingFn(stepLeft, stepRight) {
  const keyUpHandler = ({ key }) => {
    if (key === 'ArrowRight') {
      stepRight();
    }
    if (key === 'ArrowLeft') {
      stepLeft();
    }
  };
  return () => {
    window.addEventListener('keyup', keyUpHandler);
    return () => window.removeEventListener('keyup', keyUpHandler);
  };
}

function doTensorFlow() {
  // Define a model for linear regression.
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  // Generate some synthetic data for training.
  const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

  // Train the model using the data.
  model.fit(xs, ys, { epochs: 10 }).then(() => {
    // Use the model to do inference on a data point the model hasn't seen before:
    // Open the browser devtools to see the output
    model.predict(tf.tensor2d([5], [1, 1])).print();
  });
}

function autoRunStep(currState, setSimState) {
  const action = (Math.random() >= 0.5 ? LEFT : RIGHT);
  const newState = CartPoleEngine.step(action, currState);
  setSimState(newState);
  if (!newState.done) {
    setTimeout(() => autoRunStep(newState, setSimState), RUN_INTERVAL);
  }
}

function CartPoleApp() {
  const [simState, setSimState] = useState(CartPoleEngine.getInitialState());

  const stepLeft = () => setSimState(CartPoleEngine.step(LEFT, simState));
  const stepRight = () => setSimState(CartPoleEngine.step(RIGHT, simState));
  const resetFn = () => setSimState(CartPoleEngine.getInitialState());
  const stepRandom = () => (Math.random() >= 0.5 ? stepLeft() : stepRight());
  const randomAgent = () => {
    setTimeout(() => autoRunStep(simState, setSimState), RUN_INTERVAL);
  };
  useEffect(getKeyboardBindingFn(stepLeft, stepRight));

  return (
    <div className={styles.cartpoleApp}>
      <h1 className={styles.titleText}>Cartpole</h1>
      <CartPoleVisualizer simState={simState} />
      <Tabs
        selectedTabClassName={styles.selectedTab}
        selectedTabPanelClassName={styles.selectedTabPanel}
      >
        <TabList className={styles.tabList}>
          <Tab className={styles.tab}>Manual Control</Tab>
          <Tab className={styles.tab}>Random Agent</Tab>
          <Tab className={styles.tab}>TensorFlow Agent</Tab>
          <Tab className={styles.tab}>About</Tab>
        </TabList>
        <TabPanel className={styles.tabPanel}>
          <InstrumentPanel simState={simState} />
          <ManualAgentPanel
            stepLeft={stepLeft}
            resetFn={resetFn}
            stepRight={stepRight}
          />
        </TabPanel>
        <TabPanel className={styles.tabPanel}>
          <InstrumentPanel simState={simState} />
          <RandomAgentPanel
            stepRandom={stepRandom}
            resetFn={resetFn}
            randomAgent={randomAgent}
          />
        </TabPanel>
        <TabPanel className={styles.tabPanel}>
          <InstrumentPanel simState={simState} />
          <TFAgentPanel doTensorFlow={doTensorFlow} />
        </TabPanel>
        <TabPanel className={styles.tabPanel}>
          <InfoPanel />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default CartPoleApp;
