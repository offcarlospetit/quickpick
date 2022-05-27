import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home} from '../home';

type StackParamList = {
  Home: undefined;
};

const stack = createNativeStackNavigator<StackParamList>();

const HomeStack = () => {
  return (
    <stack.Navigator initialRouteName="Home">
      <stack.Screen name="Home" component={Home} />
    </stack.Navigator>
  );
};

export default HomeStack;
