import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar,
  ToastAndroid,
  Text,
  Platform,
  ImageBackground,
} from 'react-native';

import {connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import AuthActions from '@store/ducks/auth';

import {Image, Button} from 'react-native-elements';
import navigation from '@utils/navigation';
import {rootSwitch} from '@config/navigator';

import auth from '@react-native-firebase/auth';
// import statusCodes along with GoogleSignin
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';

import reactotron from 'reactotron-react-native';
import SocialMethods from './containers/SocialMethods';

const {width, height} = Dimensions.get('window');

function Auth(props) {
  // const {loginUserRequest} = props;

  return (
    <ImageBackground
      // @ts-ignore
      source={require('@images/splash.jpg')}
      resizeMode={'cover'}
      style={styles.container}>
      <StatusBar hidden />

      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -(height * 0.2),
        }}>
        <Image
          style={{
            width: width * 0.7,
            height: width * 0.7,
          }}
          // @ts-ignore
          source={require('@images/logo.png')}
          resizeMode={'contain'}
        />
        <Text
          style={{
            fontFamily: 'ProximaNova-Extrabld',
            fontSize: 72,
            marginTop: 10,
            color: '#FFF',
          }}>
          SONUS
        </Text>
        <SocialMethods {...props} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    // justifyContent: 'center',
  },
  scrollView: {
    backgroundColor: 'transparent',
    // backgroundColor: '#151515',
  },
  statusBar: {
    height: 20,
    backgroundColor: '#FFF',
  },
  bgContainer: {
    zIndex: -1,
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imgbg: {
    height: '100%',
    width: '100%',
    // opacity: 0.25,
  },
  inputIcons: {
    marginRight: 12,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  socialContainer: {
    position: 'absolute',
    bottom: height * 0.1,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  socialImgContainer: {
    zIndex: 5,
    marginLeft: 10,
    position: 'absolute',
    flex: 1,
    height: 22,
    width: 22,
  },
  socialImg: {
    height: '100%',
    width: '100%',
  },
  socialButton: {
    width: width * 0.9,
    borderRadius: 20,
  },
});

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(AuthActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
