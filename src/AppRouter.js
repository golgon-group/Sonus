import React from 'react';
import {StatusBar, View} from 'react-native';

import {connect} from 'react-redux';

import Miniplayer from '@components/Miniplayer';
import Router from '@navigation/root-nav';

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheck: false,
      isConnected: false,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <Router isGettingStart={true} />;
  }
}

export default connect()(AppRouter);
