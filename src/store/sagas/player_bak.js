/**
 * react-native-track-player dev
 */
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

import PlayerActions from '~/store/ducks/player';

import reactotron from 'reactotron-react-native';
import axios from 'axios';
import {ToastAndroid, Platform} from 'react-native';
import {Actions} from 'react-native-router-flux';

export function* trackChanged() {
  const channel = eventChannel(emitter => {
    const onTrackChange = TrackPlayer.addEventListener(
      'playback-track-changed',
      emitter,
    );

    return () => onTrackChange.remove();
  });

  try {
    while (true) {
      const {nextTrack} = yield take(channel);

      yield put(PlayerActions.setCurrent(nextTrack));
    }
  } finally {
    channel.close();
  }
}

export function* init() {
  yield call(TrackPlayer.setupPlayer, {waitForBuffer: true});

  // TrackPlayer.setupPlayer({
  //   waitForBuffer: true,
  // });

  TrackPlayer.updateOptions({
    stopWithApp: true,
    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      // TrackPlayer.CAPABILITY_PAUSE,
      // TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      // TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      TrackPlayer.CAPABILITY_STOP,
    ],
    notificationCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      // TrackPlayer.CAPABILITY_PAUSE,
      // TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      // TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      TrackPlayer.CAPABILITY_STOP,
    ],
    compactCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_STOP,
    ],
  });

  TrackPlayer.addEventListener('playback-track-changed', reactotron.log);
  TrackPlayer.addEventListener('playback-state', reactotron.log);
}

export function* setTrack({track, trackId}) {
  const currentTrack = yield select(state => state.player.track);
  yield put(PlayerActions.setLoading());

  if (currentTrack && track.id === currentTrack.id) {
    yield put(PlayerActions.stop());
  }

  // yield call(init, true);

  if (!currentTrack || track.id !== currentTrack.id) {
    yield call(TrackPlayer.stop);
    yield call(TrackPlayer.reset);

    yield call(TrackPlayer.add, track);
    yield put(PlayerActions.setTrackSuccess(track));
  }

  if (trackId) {
    yield call(TrackPlayer.skip, trackId);
    yield put(PlayerActions.setCurrent(trackId));
  }

  // reactotron.log('Currently play : ' + trackId);
  // yield put(PlayerActions.setTrackSuccess(track));
  yield put(PlayerActions.play());
  yield call(Actions.player);
  // reactotron.log('%cstarting tasks...', 'color: #16b141');
  yield call(runTasks);
  // reactotron.log('%call tasks completed', 'color: #1f29c5');
  yield call(trackChanged);
}

function* fetchData() {
  const currentTrack = yield select(state => state.player.track);
  const isStream = yield select(state => state.player.is_stream);

  reactotron.log('Lagi streaming ? ' + isStream);

  try {
    while (isStream) {
      let artist = '';
      let title = '';
      let imgart = '';

      let time = yield call(getTime);
      const programData = yield call(getProgram);

      const updTrack = yield axios
        .get(`${currentTrack.apiUrl}/nowplaying`)
        .then(res => {
          artist = res.data.song_artist;
          title = res.data.song_title;

          return axios.get(
            `https://itunes.apple.com/search?term=${artist}-${title}`,
          );
        })
        .then(respJson => {
          reactotron.log(respJson.data);
          let program = programData.data;

          if (title === '' && artist === '') {
            if (typeof program.nama_program === 'undefined') {
              title = currentTrack.title;
              artist = currentTrack.artist;
              imgart = currentTrack.artwork;
            } else {
              title =
                program.data.nama_program === ''
                  ? currentTrack.title
                  : program.data.nama_program;
              artist =
                program.data.dj === ''
                  ? currentTrack.artist
                  : program.data.dj2 === ''
                  ? program.data.dj
                  : program.data.dj + ' & ' + program.data.dj2;
              imgart =
                program.data.foto2 === ''
                  ? currentTrack.artwork
                  : 'https://www.' +
                    currentTrack.urlWeb +
                    '/assets/program_image/' +
                    program.data.foto2;
            }

            // reactotron.log({
            //   artist: artist,
            //   title: title,
            //   artwork: imgart,
            // });

            TrackPlayer.updateMetadataForTrack(currentTrack.id, {
              artist: artist,
              title: title,
              artwork: imgart,
            });
          } else {
            if (respJson.data.resultCount === 0) {
              imgart =
                'https://www.' +
                currentTrack.urlWeb +
                '/assets/program_image/' +
                program.data.foto2;
            } else {
              var ResultData = respJson.data.results[0];
              imgart = ResultData.artworkUrl100.replace(/100x100/, '500x500');
            }
            TrackPlayer.updateMetadataForTrack(currentTrack.id, {
              artist: artist,
              title: title,
              artwork: imgart,
            });
          }

          return {
            id: currentTrack.id,
            title: title,
            artist: artist,
            url: currentTrack.url,
            artwork: imgart,
            urlWeb: currentTrack.urlWeb,
            apiUrl: currentTrack.apiUrl,
            duration: time,
          };
        });
      reactotron.log('Waktu Delay : ' + Math.round(time * 1000));

      yield put(PlayerActions.setTrackSuccess(updTrack));
      yield delay(Math.round(time * 1000));
    }
  } catch (error) {
    ToastAndroid.show(
      "Can't get Meta data from server " +
        error.message +
        ', Please check you connection or Exit the App',
      ToastAndroid.SHORT,
    );

    yield put(PlayerActions.setTrackSuccess(currentTrack));
  } finally {
    if (yield cancelled()) {
      reactotron.log('Berhenti streaming !');
    }
  }
}

function* getProgram() {
  const currentTrack = yield select(state => state.player.track);
  let rData = {};

  return yield axios
    .get(`${currentTrack.apiUrl}/program/current`)
    .then(Response => {
      if (Response.data.day === '') {
        // eslint-disable-next-line dot-notation
        rData.data = currentTrack;
      } else {
        rData.data = Response.data;
      }
      return rData;
    })
    .catch(error => {
      rData.data = currentTrack;

      return rData;
    });
}

function* getTime() {
  const currentTrack = yield select(state => state.player.track);

  return yield axios
    .get(`${currentTrack.apiUrl}/nowplaying`)
    .then(Response =>
      Response.data.time_diff == '0' ? 10 : Response.data.time_diff,
    );
}

function* runTasks() {
  const isStream = yield select(state => state.player.is_stream);

  while (isStream) {
    // starts the task in the background
    const bgSyncTask = yield fork(fetchData);

    // wait for the user stop action
    yield take('STOP');
    // user clicked stop. cancel the background task
    // this will cause the forked bgSync task to jump into its finally block
    yield cancel(bgSyncTask);
  }
  // const bgSyncTask = yield fork(fetchData);
  // // const firstTask = yield fork(taskOne);
  // // const secondTask = yield fork(taskTwo);
  // // const thirdTask = yield fork(taskThree);
  // if (yield take('SET_PODCAST_REQUEST')) {
  //   yield cancel(bgSyncTask);
  // }

  // if (yield take('STOP_STREAM')) {
  //   yield cancel(bgSyncTask);
  // }
}

export function* setPodcast({podcast, podcastId}) {
  const currentPodcast = yield select(state => state.player.podcast);

  // yield call(init, false);

  if (!currentPodcast || podcastId !== currentPodcast.id) {
    yield call(TrackPlayer.stop);
    yield call(TrackPlayer.reset);

    yield call(TrackPlayer.add, [...podcast.tracks]);
    yield put(PlayerActions.setPodcastSuccess(podcast));
  }

  if (podcastId) {
    yield call(TrackPlayer.skip, podcastId);
    yield put(PlayerActions.setCurrent(podcastId));
  }

  // reactotron.log('Currently play : ' + podcastId);

  yield put(PlayerActions.play());
  yield call(trackChanged);
}

export function* play() {
  yield call(TrackPlayer.play);
}

export function* pause() {
  yield call(TrackPlayer.pause);
}

export function* prev() {
  const player = yield select(state => state.player);
  const currentIndex = player.podcast.tracks.findIndex(
    episode => episode.id === player.current,
  );

  if (player.podcast.tracks[currentIndex - 1]) {
    yield call(TrackPlayer.skipToPrevious);
    yield put(PlayerActions.play());
  }
}

export function* next() {
  const player = yield select(state => state.player);
  const currentIndex = player.podcast.tracks.findIndex(
    episode => episode.id === player.current,
  );

  if (player.podcast.tracks[currentIndex + 1]) {
    yield call(TrackPlayer.skipToNext);
    yield put(PlayerActions.play());
  }
}

export function* stop() {
  if (Platform.OS == 'android') {
    yield call(TrackPlayer.stop);
    yield call(TrackPlayer.reset);
  } else {
    yield call(TrackPlayer.pause);
  }
  // yield call(TrackPlayer.stop);
  // yield call(TrackPlayer.reset);
}

export function* setFollow({podcast}) {
  const isFollow = yield select(state => state.player.isFollowing);
  // const podcastData = yield axios
  //   .get('https://api.sonus.co.id/api/nowplaying')
  //   .then(Response =>
  //     Response.data.time_diff == '0' ? 10 : Response.data.time_diff,
  //   );
  // reactotron.log(player);
  // if (podcastData) {
  // reactotron.log('Following Podcast : ' + podcast.id);
  if (isFollow) {
    yield put(PlayerActions.setFollowSuccess(false));
  } else {
    yield put(PlayerActions.setFollowSuccess(true));
  }

  // reactotron.log('I do Follow' + isFollow);
  // }
  // FollowActions.setUnFollowSuccess();
}
