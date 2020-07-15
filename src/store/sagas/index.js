import {all, takeLatest} from 'redux-saga/effects';

import {PlayerTypes} from '~/store/ducks/player';

import {
  init,
  setTrack,
  setPodcast,
  setFollow,
  play,
  pause,
  prev,
  next,
  stop,
} from './player';

export default function* rootSaga() {
  return yield all([
    // init(false),
    init(),

    takeLatest(PlayerTypes.SET_TRACK_REQUEST, setTrack),
    takeLatest(PlayerTypes.SET_PODCAST_REQUEST, setPodcast),
    takeLatest(PlayerTypes.SET_FOLLOW_REQUEST, setFollow),

    takeLatest(PlayerTypes.PLAY, play),
    takeLatest(PlayerTypes.PAUSE, pause),

    takeLatest(PlayerTypes.PREV, prev),
    takeLatest(PlayerTypes.NEXT, next),

    takeLatest(PlayerTypes.STOP, stop),
  ]);
}
