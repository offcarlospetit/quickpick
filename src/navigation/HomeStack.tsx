import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home as HomeScreen, Detail} from '../home';

export type StackParamList = {
  HomeScreen: undefined;
  Detail: {
    id?: number;
  };
};

const stack = createNativeStackNavigator<StackParamList>();

const HomeStack = () => {
  return (
    <stack.Navigator initialRouteName="HomeScreen">
      <stack.Screen name="HomeScreen" component={HomeScreen} />
      <stack.Screen name="Detail" component={Detail} />
    </stack.Navigator>
  );
};

export default HomeStack;
