import React from 'react';
import {StatusBar, View} from 'react-native';

import {connect} from 'react-redux';

import Miniplayer from '@components/Miniplayer';
import Router from '@navigation/root-nav';

import crashlytics from '@react-native-firebase/crashlytics';

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheck: false,
      isConnected: false,
    };
  }

  componentDidMount() {
    // crashlytics().log('crash on componentDidMount.');
    // crashlytics().crash();
  }

  componentWillUnmount() {}

  render() {
    return <Router />;
  }
}

export default connect()(AppRouter);
