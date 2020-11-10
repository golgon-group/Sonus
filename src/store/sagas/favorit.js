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

import TrackPlayer from 'react-native-track-player';

import {eventChannel} from 'redux-saga';

import FavoritActions from '@store/ducks/favorit';

import reactotron from 'reactotron-react-native';
import axios from 'axios';
import {ToastAndroid, Platform} from 'react-native';

import NavigationService from '@utils/navigation';
import {rootSwitch} from '@config/navigator';

import {any} from 'prop-types';

export function* setRank({currentChannel}) {
  const currentRank = yield select((state) => state.favorit.data);
  let data = [];

  try {
    data = yield axios
      .get(`https://api.cityradio.id/v2/like/rekap/${currentChannel.id}`, {
        headers: {'sonus-apps-token': 'knksVZU27gkgRWM7nCL7WSc36xmqqUNj'},
      })
      .then((respJson) => {
        if (respJson.data.success) {
          return respJson.data.message;
        }
      });
  } catch (error) {
    reactotron.log(error);
    data = [];
  }

  yield put(FavoritActions.setRankSuccess(data));
}
