import '~/config/ReactotronConfig';
import React, {Component} from 'react';
import {StatusBar, BackHandler, ToastAndroid, AppState} from 'react-native';

import {Actions} from 'react-native-router-flux';

import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';

// @ts-ignore
import moment from 'moment/min/moment-with-locales';

import {Provider} from 'react-redux';

import store from '~/store';

import Miniplayer from '~/components/MiniPlayer';
import Loading from '~/components/Loading';

import Routes from './routes';
import reactotron from 'reactotron-react-native';
import RNMinimizeApp from 'react-native-minimize';

export default class App extends Component {
  _isMounted = false;

  constructor(props) {
    // @ts-ignore
    super(props);
    this.state = {
      firstTime: true,
      is_login: false,
      is_playing: false,
      appState: AppState.currentState,
    };
  }

  async componentDidMount() {
    await setTimeout(() => {
      SplashScreen.hide();
    }, 5000);

    this._isMounted = true;

    this._isMounted &&
      // @ts-ignore
      (await AsyncStorage.getItem('FirstTime', (error, result) => {
        if (result) {
          this.setState({
            firstTime: result === 'false' ? false : true,
          });
        }
      }));

    // moment.updateLocale('id', null);
    // @ts-ignore
    moment.locales('id');
    // AppState.addEventListener('change', this._handleAppStateChange);

    // BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid());
  }

  componentWillUnmount() {
    // BackHandler.removeEventListener('hardwareBackPress', () =>
    //   this.backAndroid(),
    // ); // Remove listener
    // AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      reactotron.log('App has come to the foreground!');
    }
    this.setState({appState: nextAppState});
  };

  backAndroid() {
    let cs = Actions.currentScene;
    // ToastAndroid.show('Current Scene : '+cs, ToastAndroid.SHORT)
    // let isOpen = Actions.;
    if (cs === 'login' || cs === '_home' || cs === 'home') {
      // reactotron.log('Current Scene : ' + cs);
      // reactotron.log('Drawer Cond : ' + JSON.stringify(isOpen));
      if (this.lastBackButtonPress + 2000 >= new Date().getTime()) {
        /* AdMobInterstitial.requestAd()
          .then(() => AdMobInterstitial.showAd())
          .catch((error) => console.log(error)); */
        // @ts-ignore
        // BackHandler.exitApp();
        RNMinimizeApp.minimizeApp();
        return true;
      }
      Actions.drawerClose();

      ToastAndroid.show(
        "Tekan 'kembali' lagi untuk keluar",
        ToastAndroid.SHORT,
      );
      this.lastBackButtonPress = new Date().getTime();
      return true;
    } else {
      Actions.pop();
    }
  }

  render() {
    return (
      <Provider store={store}>
        <StatusBar backgroundColor={'#191919'} barStyle={'light-content'} />
        <Routes firstTime={this.state.firstTime} />
        <Loading />
        <Miniplayer />
      </Provider>
    );
  }
}
