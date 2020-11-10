import {
  call,
  put,
  select,
  take,
  delay,
  cancel,
  fork,
  cancelled,
  takeLatest,
} from 'redux-saga/effects';

import {eventChannel} from 'redux-saga';

import reactotron from 'reactotron-react-native';
import axios from 'axios';

import {rootSwitch} from '@config/navigator';

import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import AuthActions from '@store/ducks/auth';
import CommonActions from '@store/ducks/common';
import PlayerActions from '@store/ducks/player';

import NavigationService from '@utils/navigation';

export function* initAuth() {
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
}

export function* loginUser({method}) {
  yield put(AuthActions.loginUserSuccess(method));
}

export function* getUser() {
  var currentUser = auth().currentUser;
  if (currentUser) {
    reactotron.log('Trying to get Current User', currentUser);
    yield put(AuthActions.getUserSuccess(currentUser));
  }
}

export function* setLogout() {
  const player = yield select((state) => state.player);

  try {
    if (player.playing) {
      yield put(PlayerActions.stop());
    }

    auth().signOut();

    yield call(NavigationService.reset, rootSwitch.auth);

    yield delay(1000);

    yield put(AuthActions.logoutUserSuccess());

    // yield put(CommonActions.commonDestroy());
  } catch (e) {
    reactotron.log(e);
  }
}
