import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import {Icon} from '../ui-kit';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="menu-fold" color={color} size={size} />
            ),
          }}
          name="Home"
          component={HomeStack}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
