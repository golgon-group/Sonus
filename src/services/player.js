import {Platform} from 'react-native';

import TrackPlayer from 'react-native-track-player';
import store from '@store';

import PlayerActions from '@store/ducks/player';
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
  // TrackPlayer.addEventListener('remote-duck', async (data) => {
  //   // debug.log('remote-duck', data);
  //   reactotron.log('remote-duck', data);
  //   let {paused: shouldPause, permanent: permanentLoss = false} = data;
  //   let didPauseTemporarily, didPauseTemporarilyTime;
  //   // // iOS:
  //   // // When using iosCategoryMode: 'spokenAudio',
  //   // // audio is automatically paused for an interruption like GPS directions.
  //   // // The pause comes BEFORE this event.
  //   // // However, audio is not automatically resumed.
  //   // // The permanent parameter is not used on iOS, only the paused parameter.
  //   // // We will assume that if paused is false, that we should resume,
  //   // // and that iOS is smart enough to only send this event if the
  //   // // interruption is what caused the pause in the first place.
  //   // // So, the only thing we need to do is resume if needed.
  //   // if (Platform.OS == 'ios') {
  //   //   if (!permanentLoss && !shouldPause) {
  //   //     store.dispatch(PlayerActions.play());
  //   //   }
  //   // }

  //   // // Android:
  //   // // When using alwaysPauseOnInterruption: true,
  //   // // audio does not automatically duck or pause.
  //   // // Instead, it forces remote-duck to happen.

  //   if (Platform.OS == 'android') {
  //     let playerState = await TrackPlayer.getState();

  //     if (shouldPause) {
  //       store.dispatch(PlayerActions.pause());
  //       if (playerState === TrackPlayer.STATE_PLAYING) {
  //         didPauseTemporarily = !permanentLoss;
  //         if (didPauseTemporarily) {
  //           didPauseTemporarilyTime = Date.now();
  //         }
  //       } else {
  //         didPauseTemporarily = false;
  //       }
  //     } else if (didPauseTemporarily) {
  //       //only resume playback if
  //       //this was a temporary interruption AND
  //       //the state is paused AND
  //       //less than 30 seconds have elapsed since pausing
  //       if (playerState === TrackPlayer.STATE_PAUSED) {
  //         let secondsSincePause = (Date.now() - didPauseTemporarilyTime) / 1000;
  //         if (secondsSincePause < 30) {
  //           store.dispatch(PlayerActions.play());
  //         }
  //       }
  //       didPauseTemporarily = false;
  //     }
  //   }
  // });

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
