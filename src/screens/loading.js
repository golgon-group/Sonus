import React, {Component} from 'react';
import {Platform} from 'react-native';

import {GoogleSignin} from '@react-native-community/google-signin';

import SplashScreen from 'react-native-splash-screen';
import reactotron from 'reactotron-react-native';

import auth from '@react-native-firebase/auth';

import {rootSwitch} from '@config/navigator';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CommonActions from '@store/ducks/common';

class LoadingScreen extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.getDataAsync();
  }

  /**
   * Init data
   * @returns {Promise<void>}
   */
  getDataAsync = async () => {
    const {common} = this.props;
    var isLogin = await auth().currentUser;

    try {
      const {navigation, route} = this.props;
      const {isGettingStart} = route.params;

      const router = !isLogin
        ? rootSwitch.auth
        : !common.data
        ? rootSwitch.choose
        : rootSwitch.main;

      navigation.replace(router);

      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);
    } catch (e) {
      reactotron.error('Masuk Loading Error', e);
    }
  };

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  common: state.common,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(CommonActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
