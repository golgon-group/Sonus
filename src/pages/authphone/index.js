import React, {Component} from 'react';

import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ToastAndroid,
  StatusBar,
  KeyboardAvoidingView,
  View,
  ScrollView,
  TouchableHighlight,
} from 'react-native';

import {Fonts, Theme} from '~/constants';
import {Button, Icon, Input} from '~/components';

import {Actions} from 'react-native-router-flux';

import FastImage from 'react-native-fast-image';

import AsyncStorage from '@react-native-community/async-storage';

// import statusCodes along with GoogleSignin
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {LoginManager} from 'react-native-fbsdk';

import reactotron from 'reactotron-react-native';

const {width, height} = Dimensions.get('window');
const isIos = Platform.OS === 'ios';
const isIphoneX = isIos && Dimensions.get('window').height === 812;
const HOME_ACTIVITY_INDICATOR = isIphoneX ? 34 : 0;
const APPBAR_HEIGHT =
  isIos && Dimensions.get('window').height === 812 ? 44 : 20;

export default class Myapp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      otp_code: true,
      url: '',
    };

    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this.setState({
      is_login: null,
      email: null,
      password: null,
      hidePassword: true,
      url: '',
    });

    this._isMounted = false;
  }

  async validateLogin() {
    ToastAndroid.show('We Test some login button', ToastAndroid.SHORT);
    setTimeout(() => {
      AsyncStorage.setItem('is_login', 'true');
      AsyncStorage.setItem('user_name', this.state.email);
      AsyncStorage.setItem('roles', 'admin');
      Actions.drawer();
    }, 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            flex: 1,
            paddingTop: height * 0.09,
          }}
          style={styles.scrollView}>
          <FastImage
            style={{
              zIndex: -1,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.25,
            }}
            // @ts-ignore
            source={require('~/assets/images/girlhs.png')}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FastImage
              style={{
                zIndex: 10,
                width: 232,
                height: 237,
              }}
              // @ts-ignore
              source={require('~/assets/images/Logo-Sonus-03.png')}
              resizeMode={FastImage.resizeMode.contain}
            />
            {/* <View style={{width: '90%'}}>
              <Input
                label="Email"
                onChangeText={text => this.setState({email: text})}
                value={this.state.email}
              />
            </View>
            <View style={{width: '90%', justifyContent: 'center'}}>
              <Input
                secureTextEntry={this.state.hidePassword}
                label="Password"
                onChangeText={text => this.setState({password: text})}
                value={this.state.password}
              />
              <TouchableHighlight
                onPress={() => {
                  this.setState({hidePassword: !this.state.hidePassword});
                }}
                style={{position: 'absolute', right: 10}}>
                <Icon
                  name={this.state.hidePassword ? 'ios-eye-off' : 'ios-eye'}
                  family={'ionicon'}
                  size={20}
                  color={Theme.COLORS.WHITE}
                />
              </TouchableHighlight>
            </View> */}
            <View style={{height: '20%'}} />
            <View style={{width: '90%'}}>
              <Input
                label="Phone Number"
                onChangeText={text => this.setState({phone: text})}
                value={this.state.phone}
              />
            </View>
            <View style={{height: 10}} />
            <Button
              title="Send"
              titleStyle={{
                fontSize: 14,
                color: '#191919',
                fontFamily: Fonts.FONTS.SECONDARY,
              }}
              buttonStyle={styles.createButton}
              onPress={() => {
                reactotron.log('Send OTP Code');
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scrollView: {
    backgroundColor: '#151515',
  },
  statusBar: {
    height: 20,
    backgroundColor: '#FFF',
  },
  inputIcons: {
    marginRight: 12,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    backgroundColor: Theme.COLORS.WHITE,
    borderRadius: 20,
  },
  socialContainer: {
    // position: 'absolute',
    // bottom: height / 10,
    marginTop: '10%',
    width: '100%',
    alignItems: 'center',
  },
  socialImg: {
    zIndex: 5,
    marginLeft: 10,
    position: 'absolute',
    flex: 1,
    height: 22,
    width: 22,
  },
  socialButton: {
    width: width * 0.9,
    borderRadius: 20,
  },
});
