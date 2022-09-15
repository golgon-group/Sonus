import {all, takeLatest, takeEvery} from 'redux-saga/effects';

import {PlayerTypes} from '@store/ducks/player';

import {
  init,
  setTrack,
  setPodcast,
  setFollow,
  play,
  pause,
  prev,
  next,
  reset,
  like,
  dislike,
  setShows,
  playback,
} from './player';

import {CommonTypes} from '@store/ducks/common';

import {setChannel, setSleep} from './common';

import {FavoritTypes} from '@store/ducks/favorit';

import {setRank} from './favorit';

import {AuthTypes} from '@store/ducks/auth';

import {initAuth, loginUser, setLogout, getUser} from './auth';

export default function* rootSaga() {
  return yield all([
    // init(false),
    initAuth(),
    init(),
    takeEvery(CommonTypes.SET_CHANNEL_REQUEST, setChannel),

    takeLatest(CommonTypes.SET_SLEEP, setSleep),

    takeLatest(PlayerTypes.SET_SHOW_REQUEST, setShows),

    takeLatest(PlayerTypes.SET_TRACK_REQUEST, setTrack),
    // takeLatest(PlayerTypes.SET_PODCAST_REQUEST, setPodcast),
    // takeLatest(PlayerTypes.SET_FOLLOW_REQUEST, setFollow),

    takeLatest(FavoritTypes.SET_RANK_REQUEST, setRank),

    takeLatest(PlayerTypes.PLAY, play),
    takeLatest(PlayerTypes.PAUSE, pause),

    takeLatest(PlayerTypes.PLAYBACK, playback),

    takeLatest(PlayerTypes.PREV, prev),
    takeLatest(PlayerTypes.NEXT, next),

    takeLatest(PlayerTypes.RESET, reset),

    takeLatest(PlayerTypes.LIKE, like),
    takeLatest(PlayerTypes.DISLIKE, dislike),

    takeLatest(AuthTypes.LOGIN_USER_REQUEST, loginUser),
    takeLatest(AuthTypes.GET_USER_REQUEST, getUser),

    takeLatest(AuthTypes.LOGOUT_USER_REQUEST, setLogout),
  ]);
}
