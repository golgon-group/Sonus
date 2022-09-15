import {Platform} from 'react-native';

import TrackPlayer, {TrackPlayerEvents} from 'react-native-track-player';
// @ts-ignore
import store from '@store';

import PlayerActions from '@store/ducks/player';
import reactotron from 'reactotron-react-native';

export default async () => {
  TrackPlayer.addEventListener(TrackPlayerEvents.REMOTE_PLAY, () => {
    store.dispatch(PlayerActions.play());
  });
  TrackPlayer.addEventListener(TrackPlayerEvents.REMOTE_PAUSE, () => {
    store.dispatch(PlayerActions.pause());
  });
  TrackPlayer.addEventListener(TrackPlayerEvents.REMOTE_NEXT, () => {
    store.dispatch(PlayerActions.next());
  });
  TrackPlayer.addEventListener(TrackPlayerEvents.REMOTE_PREVIOUS, () => {
    store.dispatch(PlayerActions.prev());
  });
  TrackPlayer.addEventListener(TrackPlayerEvents.REMOTE_STOP, () => {
    store.dispatch(PlayerActions.stop());
  });
  TrackPlayer.addEventListener(TrackPlayerEvents.REMOTE_DUCK, async (data) => {
    let playerState = await TrackPlayer.getState();

    store.dispatch(PlayerActions.playback(data, playerState));
  });
};
