import React, { useState, useEffect } from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';


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
        defaultIndex={2}
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
          <TFAgentPanel />
        </TabPanel>
        <TabPanel className={styles.tabPanel}>
          <InfoPanel />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default CartPoleApp;
