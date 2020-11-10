import React, {Component} from 'react';
import {
  View,
  Dimensions,
  Text,
  StatusBar,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {Image} from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import reactotron from 'reactotron-react-native';

import FastImage from 'react-native-fast-image';

const {height, width} = Dimensions.get('window');

let version = DeviceInfo.getVersion();
let buildNumber = DeviceInfo.getBuildNumber();

class Choose extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <ImageBackground
        source={require('@images/splash.jpg')}
        resizeMode={'cover'}
        style={styles.imgBg}>
        <StatusBar hidden={false} />
        <View style={styles.logoContainer}>
          <Image
            style={{width: width * 0.7, height: width * 0.7}}
            source={require('@images/logo.png')}
            resizeMode={'contain'}
          />
          <Text style={styles.lblTitle}>SONUS</Text>
        </View>
        <View style={styles.vwVersion}>
          <Text style={styles.lblVersion}>{version}</Text>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  imgBg: {flex: 1},
  logoContainer: {
    position: 'absolute',
    left: 0,
    top: height * 0.1,
    right: 0,
    alignItems: 'center',
  },
  lblTitle: {
    fontFamily: 'ProximaNova-Extrabld',
    fontSize: 72,
    marginTop: 10,
    color: '#FFF',
  },
  vwVersion: {
    position: 'absolute',
    bottom: height * 0.03,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  lblVersion: {
    fontFamily: 'ProximaNova-Regular',
    fontSize: 16,
    color: '#FFF',
  },
});

export default connect()(Choose);
