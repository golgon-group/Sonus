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

import auth from '@react-native-firebase/auth';
// import statusCodes along with GoogleSignin
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';

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
    this.state = {};
  }

  async componentDidMount() {
    GoogleSignin.configure({
      scopes: [], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '217314848363-t8kuqno8j0aqm48sj1sfc2pfq88ectj3.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      // @ts-ignore
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
      // iosClientId:
      //   '217314848363-54o7ffmpcf8grn97vnbtpt848945etgt.apps.googleusercontent.com',
    });

    this.getDataAsync();
  }

  componentWillUnmount() {}

  _signInFacebook = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  };

  // Somewhere in your code
  _signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        reactotron.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        reactotron.log(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        reactotron.log(error);
      } else {
        ToastAndroid.show(
          'Something went wrong contact Developers !',
          ToastAndroid.SHORT,
        );
        // some other error happened
        reactotron.log(error);
      }
    }
  };

  getDataAsync = async () => {
    // firebase.initializeApp();
    // var user = auth().currentUser;

    try {
      var user = await auth().currentUser;

      reactotron.log(user);

      if (user) {
        Actions.drawer();
      } else {
        // No user is signed in.
        reactotron.log('No User is signed in');
      }
    } catch (e) {
      // @ts-ignore
      reactotron.error(e);
    }
  };

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
            style={styles.imgbg}
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
            <View style={{height: '20%'}} />
            <View style={styles.socialContainer}>
              <View style={{justifyContent: 'center'}}>
                <FastImage
                  style={styles.socialImg}
                  // @ts-ignore
                  source={require('~/assets/images/Facebook.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Button
                  title="Log in with Facebook"
                  titleStyle={{
                    fontSize: 14,
                    color: '#FFF',
                    fontFamily: Fonts.FONTS.Label,
                  }}
                  buttonStyle={[
                    styles.socialButton,
                    {backgroundColor: '#4267B2'},
                  ]}
                  onPress={() => {
                    this._signInFacebook().then(() => {
                      ToastAndroid.show('Login successful', ToastAndroid.SHORT);

                      setTimeout(() => {
                        Actions.drawer();
                      }, 700);
                    });
                  }}
                />
              </View>
              <View style={{height: 20}} />
              <View style={{justifyContent: 'center'}}>
                <FastImage
                  style={styles.socialImg}
                  // @ts-ignore
                  source={require('~/assets/images/Google.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Button
                  title="Log in with Google"
                  titleStyle={{
                    fontSize: 14,
                    color: '#191919',
                    fontFamily: Fonts.FONTS.Label,
                  }}
                  buttonStyle={[styles.socialButton, {backgroundColor: '#FFF'}]}
                  onPress={() => {
                    this._signInGoogle().then(() => {
                      ToastAndroid.show('Login successful', ToastAndroid.SHORT);

                      setTimeout(() => {
                        Actions.drawer();
                      }, 700);
                    });
                  }}
                />
              </View>
            </View>
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
  imgbg: {
    zIndex: -1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.25,
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
