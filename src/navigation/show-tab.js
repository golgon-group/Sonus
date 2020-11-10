import React, {Component} from 'react';
import {Text} from 'react-native';

import {connect} from 'react-redux';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import Shows from '@screens/shows';
import Contact from '@screens/contact';

import {showTabs} from '@config/navigator';

const Tab = createMaterialTopTabNavigator();

function ShowTab(props) {
  const {common} = props;
  return (
    <Tab.Navigator
      initialRouteName={showTabs.show}
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: common.themeColor,
        },
      }}
      screenOptions={({route}) => ({
        tabBarLabel: ({focused, color, size}) => {
          let labelName;

          if (route.name == showTabs.show) {
            labelName = 'Shows';
          } else if (route.name == showTabs.contact) {
            labelName = 'Contact Us';
          }

          return (
            <Text
              style={{
                fontFamily: 'ProximaNova-Extrabld',
                fontSize: 16,
                color: focused ? common.themeColor : '#273746',
              }}>
              {labelName}
            </Text>
          );
        },
      })}>
      <Tab.Screen name={showTabs.show} component={Shows} />
      <Tab.Screen name={showTabs.contact} component={Contact} />
    </Tab.Navigator>
  );
}

const mapStateToProps = (state) => ({
  common: state.common.data,
});

export default connect(mapStateToProps)(ShowTab);
