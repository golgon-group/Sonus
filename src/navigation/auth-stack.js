import React from 'react';

import {authStack} from '@config/navigator';

import {createStackNavigator} from '@react-navigation/stack';

import Login from '@screens/auth';

const Stack = createStackNavigator();

function AuthStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={authStack.login} component={Login} />
    </Stack.Navigator>
  );
}

export default AuthStack;
