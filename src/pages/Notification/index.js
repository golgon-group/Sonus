import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

import {Actions} from 'react-native-router-flux';

export default class Notification extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Text>This is Notification</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
