/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { Text, View } from 'react-native';
import Login from '@login/index';

export const App = () => {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Sofisapro</Text>
      <Login />
    </View>
  );
};

export default App;

