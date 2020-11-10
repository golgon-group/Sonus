import {
  call,
  put,
  select,
  take,
  delay,
  cancel,
  fork,
  cancelled,
} from 'redux-saga/effects';

import {
  Platform,
  DeviceEventEmitter,
  NativeAppEventEmitter,
  BackHandler,
} from 'react-native';

import {eventChannel} from 'redux-saga';

import CommonActions from '@store/ducks/common';
import PlayerActions from '@store/ducks/player';

import NavigationService from '@utils/navigation';

import reactotron from 'reactotron-react-native';
import {rootSwitch} from '@config/navigator';
import BackgroundTimer from 'react-native-background-timer';

import TrackPlayer from 'react-native-track-player';

import RNExitApp from 'react-native-exit-app';

// const EventEmitter = Platform.select({
//   ios: () => NativeAppEventEmitter,
//   android: () => DeviceEventEmitter,
// })();

export function* setChannel({value}) {
  const currentChannel = yield select((state) => state.common.data);

  if (!currentChannel || value.data.id !== currentChannel.id) {
    yield put(CommonActions.setChannelSuccess(value));
  }

  if (!currentChannel) {
    // yield call(NavigationService.replace, rootSwitch.main);
    yield call(NavigationService.reset, rootSwitch.main);
  }
}

export function* setSleep({time}) {
  const player = yield select((state) => state.player);

  BackgroundTimer.stopBackgroundTimer();

  while (player.playing) {
    const snapshot = yield call(sleepTimer, time);

    if (snapshot) {
      yield put(PlayerActions.stop());
      yield put(CommonActions.resetTimer());

      yield call(TrackPlayer.destroy);

      // yield put(PlayerActions.init());
      // yield call(BackHandler.exitApp);
      yield call(RNExitApp.exitApp);
      BackgroundTimer.stopBackgroundTimer();

      break;
    }
  }
}

function sleepTimer(time) {
  return new Promise((resolve) => {
    BackgroundTimer.runBackgroundTimer(() => {
      resolve(true);
    }, time * 60 * 1000);
  });
}
