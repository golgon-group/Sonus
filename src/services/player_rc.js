import {Platform} from 'react-native';
import TrackPlayer, {Event} from 'react-native-track-player';
import store from '@store';

import PlayerActions from '@store/ducks/player';

// export default async () => {
//   TrackPlayer.addEventListener(Event.RemotePlay, () => {
//     store.dispatch(PlayerActions.play());
//   });
//   TrackPlayer.addEventListener(Event.RemotePause, () => {
//     store.dispatch(PlayerActions.pause());
//   });
//   TrackPlayer.addEventListener(Event.RemoteNext, () => {
//     store.dispatch(PlayerActions.next());
//   });
//   TrackPlayer.addEventListener(Event.RemotePrevious, () => {
//     store.dispatch(PlayerActions.prev());
//   });
//   TrackPlayer.addEventListener(Event.RemoteStop, () => {
//     store.dispatch(PlayerActions.reset());
//   });
// };

module.exports = async function () {
  TrackPlayer.addEventListener(
    Event.RemotePlay,
    async () => await TrackPlayer.play(),
  );

  TrackPlayer.addEventListener(
    Event.RemotePause,
    async () => await TrackPlayer.pause(),
  );

  TrackPlayer.addEventListener(
    Event.RemoteStop,
    async () => await TrackPlayer.pause().then(() => TrackPlayer.destroy()),
  );

  TrackPlayer.addEventListener(
    Event.RemoteNext,
    async () => await TrackPlayer.skipToNext(),
  );

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async ({position}) => {
    console.log('remote-jump-forward');
    if (position + 10 < (await TrackPlayer.getDuration())) {
      await TrackPlayer.seekTo(position + 10);
    } else {
      await TrackPlayer.seekTo(0);
    }
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async ({position}) => {
    console.log('remote-jump-backward');
    if (position > 10) {
      await TrackPlayer.seekTo(position - 10);
    } else {
      await TrackPlayer.seekTo(0);
    }
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    const time = await TrackPlayer.getPosition();

    if (time <= 3) {
      await TrackPlayer.skipToPrevious();
    } else {
      await TrackPlayer.seekTo(0);
    }
  });

  TrackPlayer.addEventListener(
    Event.RemoteSeek,
    async ({position}) => await TrackPlayer.seekTo(position),
  );

  if (Platform.OS !== 'ios') {
    // this event type is not supported on iOS
    TrackPlayer.addEventListener(Event.RemoteDuck, async ({ducking}) => {
      await TrackPlayer.setVolume(ducking ? 0.5 : 1);
    });
  }
};
