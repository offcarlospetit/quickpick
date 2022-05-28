import React from 'react';
import {CoreProvider} from './src/core';
import AppNavigator from './src/navigation';

type Props = {};

const App = (props: Props) => {
  return (
    <CoreProvider>
      <AppNavigator />
    </CoreProvider>
  );
};

export default App;
