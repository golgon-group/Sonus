import {Platform} from 'react-native';

import TrackPlayer from 'react-native-track-player';
import store from '~/store';

import PlayerActions from '~/store/ducks/player';
import reactotron from 'reactotron-react-native';

export default async () => {
  TrackPlayer.addEventListener('remote-play', () => {
    store.dispatch(PlayerActions.play());
  });
  TrackPlayer.addEventListener('remote-pause', () => {
    store.dispatch(PlayerActions.pause());
  });
  TrackPlayer.addEventListener('remote-next', () => {
    store.dispatch(PlayerActions.next());
  });
  TrackPlayer.addEventListener('remote-previous', () => {
    store.dispatch(PlayerActions.prev());
  });
  TrackPlayer.addEventListener('remote-stop', () => {
    store.dispatch(PlayerActions.stop());
  });

  // if (Platform.OS === 'android') {
  //   // @ts-ignore
  //   TrackPlayer.addEventListener('playback-metadata-received', async e => {
  //     const currentTrack = await TrackPlayer.getCurrentTrack();
  //     reactotron.log(e);
  //     TrackPlayer.updateMetadataForTrack(currentTrack, {
  //       title: e.title,
  //       artist: e.artist,
  //       artwork: e.artwork,
  //       duration: e.duration,
  //     });
  //   });
  // }
};
