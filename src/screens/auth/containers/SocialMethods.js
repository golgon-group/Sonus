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

import {Image, Button} from 'react-native-elements';
import navigation from '@utils/navigation';
import {rootSwitch} from '@config/navigator';

import auth from '@react-native-firebase/auth';

import {LoginManager, AccessToken} from 'react-native-fbsdk';

// import statusCodes along with GoogleSignin
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import {
  appleAuth,
  appleAuthAndroid,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

import reactotron from 'reactotron-react-native';

const {width, height} = Dimensions.get('window');

function SocialMethods(props) {
  const {loginUserRequest} = props;

  const _signInFacebook = async () => {
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
    return auth()
      .signInWithCredential(facebookCredential)
      .then((val) => {
        if (val !== undefined) {
          loginUserRequest('Facebook');

          Platform.OS === 'android' &&
            ToastAndroid.show('Login successful', ToastAndroid.SHORT);

          setTimeout(() => {
            navigation.navigate(rootSwitch.choose);
          }, 700);
        }
      });
  };

  // Somewhere in your code
  const _signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth()
        .signInWithCredential(googleCredential)
        .then((val) => {
          if (val !== undefined) {
            loginUserRequest('Google');

            Platform.OS === 'android' &&
              ToastAndroid.show('Login successful', ToastAndroid.SHORT);

            setTimeout(() => {
              navigation.navigate(rootSwitch.choose);
            }, 700);
          }
        });
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
        Platform.OS === 'android' &&
          ToastAndroid.show(
            'Something went wrong contact Developers !',
            ToastAndroid.SHORT,
          );
        // some other error happened
        reactotron.log(error);
      }
    }
  };

  const _signInApple = async () => {
    try {
      // 1). start a apple sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // 2). if the request was successful, extract the token and nonce
      const {identityToken, nonce} = appleAuthRequestResponse;

      // can be null in some scenarios
      if (identityToken) {
        // 3). create a Firebase `AppleAuthProvider` credential
        const appleCredential = auth.AppleAuthProvider.credential(
          identityToken,
          nonce,
        );

        // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
        //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
        //     to link the account to an existing user
        // const userCredential = await auth().signInWithCredential(
        //   appleCredential,
        // );

        // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
        // console.warn(
        //   `Firebase authenticated via Apple, UID: ${userCredential.user.uid}`,
        // );

        // loginUserRequest('Apple');

        return auth()
          .signInWithCredential(appleCredential)
          .then((val) => {
            if (val !== undefined) {
              loginUserRequest('Apple');

              setTimeout(() => {
                navigation.navigate(rootSwitch.choose);
              }, 700);
            }
          });
      } else {
        // handle this - retry?
      }
    } catch (e) {
      console.warn(e);
      reactotron.log(e);
    }
  };

  return (
    <View style={styles.socialContainer}>
      <View style={{justifyContent: 'center'}}>
        <View style={styles.socialImgContainer}>
          <Image
            style={styles.socialImg}
            // @ts-ignore
            source={require('@images/Facebook.png')}
            resizeMode={'contain'}
          />
        </View>
        <Button
          title="Sign in with Facebook"
          titleStyle={{
            fontSize: 14,
            color: '#FFF',
            fontFamily: 'ProximaNova-Regular',
          }}
          buttonStyle={[styles.socialButton, {backgroundColor: '#4267B2'}]}
          onPress={() => {
            _signInFacebook();
          }}
        />
      </View>
      <View style={{height: 20}} />
      <View style={{justifyContent: 'center'}}>
        <View style={styles.socialImgContainer}>
          <Image
            style={styles.socialImg}
            // @ts-ignore
            source={require('@images/Google.png')}
            resizeMode={'contain'}
          />
        </View>
        <Button
          title="Sign in with Google"
          titleStyle={{
            fontSize: 14,
            color: '#191919',
            fontFamily: 'ProximaNova-Regular',
          }}
          buttonStyle={[styles.socialButton, {backgroundColor: '#FFF'}]}
          onPress={() => {
            _signInGoogle();
          }}
        />
      </View>
      {appleAuth.isSupported && (
        // (appleAuthAndroid.isSupported || appleAuth.isSupported) && (
        <>
          <View style={{height: 20}} />
          <AppleButton
            cornerRadius={20}
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            style={[styles.socialButton, {height: 40}]}
            onPress={() => _signInApple()}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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

export default SocialMethods;
