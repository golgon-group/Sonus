/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import '@config/ReactotronConfig';

import React, {Component} from 'react';
import {BackHandler, Platform, ToastAndroid} from 'react-native';

import AppRouter from './AppRouter';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';

// import configStore from './store';
import {store, persistor} from './store';
// import store2 from './store/index_no';
import {MenuProvider} from 'react-native-popup-menu';
import {PersistGate} from 'redux-persist/integration/react';

import {_navigator} from '@utils/navigation';

import reactotron from 'reactotron-react-native';

// const {store, persistor} = configStore();

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  lastBackButtonPress = 0;

  _customBackHandler = () => {
    const {index, routes} = _navigator.dangerouslyGetState();
    const screenName = routes[index].name;

    const cs = _navigator.getCurrentRoute();
    reactotron.log('Current Scene', screenName, cs);

    reactotron.log(_navigator);

    if (
      cs === 'TimerScreen' ||
      cs === 'ShowTabs' ||
      cs === 'PlayerScreen' ||
      cs === 'FavoritScreen' ||
      cs === 'TimerScreen'
    ) {
      if (this.lastBackButtonPress + 2000 >= new Date().getTime()) {
        /* AdMobInterstitial.requestAd()
          .then(() => AdMobInterstitial.showAd())
          .catch((error) => reactotron.log(error)); */
        BackHandler.exitApp();
        return true;
      }
      Platform.OS == 'android' &&
        ToastAndroid.show(
          "Tekan 'kembali' lagi untuk keluar",
          ToastAndroid.SHORT,
        );
      this.lastBackButtonPress = new Date().getTime();
      return true;
    } else {
      _navigator.goBack();
    }
  };

  // componentDidMount() {
  //   BackHandler.addEventListener('hardwareBackPress', this._customBackHandler);
  // }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener(
  //     'hardwareBackPress',
  //     this._customBackHandler,
  //   );
  // }

  render() {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppRouter />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    );
  }
}
