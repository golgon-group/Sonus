import TrackPlayer, {Event} from 'react-native-track-player';
import store from '~/store';

import PlayerActions from '~/store/ducks/player';

export default (player = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    store.dispatch(PlayerActions.play());
  });
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    store.dispatch(PlayerActions.pause());
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    store.dispatch(PlayerActions.next());
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    store.dispatch(PlayerActions.prev());
  });
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    store.dispatch(PlayerActions.reset());
  });
});
