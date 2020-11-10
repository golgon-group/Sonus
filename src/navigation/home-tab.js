import React, {Component} from 'react';
import {Platform, BackHandler, ToastAndroid, Text} from 'react-native';

import {connect} from 'react-redux';

import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';

import {homeTabs} from '@config/navigator';

import Recent from '@screens/recent';
import Player from '@screens/player';
import Favorit from '@screens/favorit';
import Timer from '@screens/timer';

import showTab from '@navigation/show-tab';

import {Icon} from 'react-native-elements';
import reactotron from 'reactotron-react-native';

const Tab = createBottomTabNavigator();

class HomeTabs extends Component {
  constructor(props) {
    super(props);
  }

  // lastBackButtonPress = 0;

  // _backHandler = () => {
  //   const {navigation} = this.props;
  //   const {index, routes} = navigation.dangerouslyGetState();
  //   const screenName = routes[index].name;
  //   reactotron.log('Current Scene', screenName);

  //   if (screenName == 'MainStack') {
  //     if (this.lastBackButtonPress + 2000 >= new Date().getTime()) {
  //       /* AdMobInterstitial.requestAd()
  //         .then(() => AdMobInterstitial.showAd())
  //         .catch((error) => reactotron.log(error)); */
  //       BackHandler.exitApp();
  //       return true;
  //     }
  //     Platform.OS == 'android' &&
  //       ToastAndroid.show(
  //         "Tekan 'kembali' lagi untuk keluar",
  //         ToastAndroid.SHORT,
  //       );
  //     this.lastBackButtonPress = new Date().getTime();
  //     return true;
  //   }
  // };

  // componentDidMount() {
  //   BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  // }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  // }

  render() {
    // const {currentTrack} = this.props;
    const {navigation, common} = this.props;

    return (
      <Tab.Navigator
        initialRouteName={homeTabs.player}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name == homeTabs.recent) {
              iconName = 'replay';
            } else if (route.name == homeTabs.shows) {
              iconName = 'microphone';
            } else if (route.name == homeTabs.player) {
              iconName = 'headphones';
            } else if (route.name == homeTabs.favorit) {
              iconName = 'heart';
            } else if (route.name == homeTabs.timer) {
              iconName = 'alarm-check';
            }

            return (
              <Icon
                name={iconName}
                type={'material-community'}
                size={32}
                color={focused ? common.themeColor : '#273746'}
              />
            );
          },
          tabBarLabel: ({focused, color, size}) => {
            let labelName;

            if (route.name == homeTabs.recent) {
              labelName = 'Recent';
            } else if (route.name == homeTabs.shows) {
              labelName = 'Shows';
            } else if (route.name == homeTabs.player) {
              labelName = 'Player';
            } else if (route.name == homeTabs.favorit) {
              labelName = 'Favorites';
            } else if (route.name == homeTabs.timer) {
              labelName = 'Timer';
            }

            return (
              <Text
                style={{
                  fontFamily: 'ProximaNova-Regular',
                  color: focused ? common.themeColor : '#273746',
                }}>
                {labelName}
              </Text>
            );
          },
        })}
        tabBarOptions={{
          labelPosition: 'below-icon',
          keyboardHidesTabBar: true,
          activeTintColor: common.themeColor,
          inactiveTintColor: '#273746',
        }}>
        <Tab.Screen name={homeTabs.recent} component={Recent} />
        <Tab.Screen name={homeTabs.shows} component={showTab} />
        <Tab.Screen name={homeTabs.player} component={Player} />
        <Tab.Screen name={homeTabs.favorit} component={Favorit} />
        <Tab.Screen name={homeTabs.timer} component={Timer} />
      </Tab.Navigator>
    );
  }
}

const mapStateToProps = (state) => ({
  common: state.common.data,
});

// const mapDispatchToProps = (dispatch) =>
//   bindActionCreators(PlayerActions, dispatch);

export default connect(mapStateToProps)(HomeTabs);
