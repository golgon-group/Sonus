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

import TrackPlayer, {Capability} from 'react-native-track-player';

import {eventChannel} from 'redux-saga';

import PlayerActions from '@store/ducks/player';

import reactotron from 'reactotron-react-native';
import axios from 'axios';
import {ToastAndroid, Platform} from 'react-native';

import NavigationService from 'src/utils/navigation';
import {rootSwitch} from '@config/navigator';

import {any} from 'prop-types';

export function* trackChanged() {
  const channel = eventChannel((emitter) => {
    const onTrackChange = TrackPlayer.addEventListener(
      'playback-track-changed',
      emitter,
    );

    return () => onTrackChange.remove();
  });

  try {
    while (true) {
      const {nextTrack} = yield take(channel);

      reactotron.log('Next Track', nextTrack);

      yield put(PlayerActions.setCurrent(nextTrack));
    }
  } finally {
    channel.close();
  }
}

export function* metadataChanged() {
  const Metachannel = eventChannel((emitter) => {
    const metaDataChange = TrackPlayer.addEventListener(
      // @ts-ignore
      'playback-metadata-received',
      (e) => {
        reactotron.log(e);
        emitter(e);
      },
    );

    return () => metaDataChange.remove();
  });

  try {
    while (true) {
      const nextMeta = yield take(Metachannel);

      if (nextMeta.artist !== null) {
        yield call(updMetaData, nextMeta);
      }
      // yield put(PlayerActions.setCurrent(nextTrack));
    }
  } finally {
    Metachannel.close();
  }
}

export function* init() {
  yield call(TrackPlayer.setupPlayer, {waitForBuffer: true});

  // TrackPlayer.setupPlayer({
  //   waitForBuffer: true,
  // });

  TrackPlayer.updateOptions({
    alwaysPauseOnInterruption: true,
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.Stop,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
  });

  TrackPlayer.addEventListener('playback-track-changed', reactotron.log);
  TrackPlayer.addEventListener('playback-state', reactotron.log);

  // yield call(metadataChanged);
}

export function* setTrack({track, trackId}) {
  const currentTrack = yield select((state) => state.player.track);

  yield put(PlayerActions.setLoading());

  if (currentTrack && track.id === currentTrack.id) {
    yield put(PlayerActions.stop());
  }

  // yield call(init, true);

  if (!currentTrack || track.id !== currentTrack.id) {
    yield call(TrackPlayer.stop);
    yield call(TrackPlayer.reset);

    yield call(TrackPlayer.add, {
      id: track.id,
      url: track.url,
      title: track.title,
      artist: track.artist,
      artwork: track.artwork,
      duration: track.duration,
    });
    yield put(PlayerActions.setTrackSuccess(track));
  }

  if (trackId) {
    yield call(TrackPlayer.skip, trackId);
    yield put(PlayerActions.setCurrent(trackId));
  }

  // reactotron.log('Currently play : ' + trackId);
  // yield put(PlayerActions.setTrackSuccess(track));
  // yield call(Actions.player);

  yield delay(1000);
  yield put(PlayerActions.play());
  // reactotron.log('%cstarting tasks...', 'color: #16b141');
  // yield call(runTasks);
  // reactotron.log('%call tasks completed', 'color: #1f29c5');
  yield call(trackChanged);
}

function* fetchData() {
  const currentTrack = yield select((state) => state.player.track);
  const isStream = yield select((state) => state.player.is_stream);

  reactotron.log('Lagi streaming ? ' + isStream);

  while (isStream) {
    let artist = '';
    let title = '';
    let imgart = null;
    let time = 10;
    const programData = yield call(getProgram);
    let updTrack = null;

    time = yield call(getTime);

    yield axios.get(`${currentTrack.apiUrl}/nowplaying`).then((res) => {
      artist = res.data.song_artist;
      title = res.data.song_title;
      imgart = currentTrack.artwork;

      updTrack = {
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

    if (title === '' && artist === '') {
      // reactotron.log('Nama Program Acara ', programData.data);

      if (typeof programData.data.nama_program === 'undefined') {
        title = currentTrack.title;
        artist = currentTrack.artist;
        imgart = currentTrack.artwork;

        reactotron.log('Masuk Kosong / Error');
      } else {
        title =
          programData.data.nama_program === ''
            ? currentTrack.title
            : programData.data.nama_program;
        artist =
          programData.data.nama_program === ''
            ? currentTrack.artist
            : programData.data.dj2 === ''
            ? programData.data.dj
            : programData.data.dj + ' & ' + programData.data.dj2;
        imgart =
          programData.data.nama_program === ''
            ? currentTrack.artwork
            : 'https://www.' +
              currentTrack.urlWeb +
              '/assets/program_image/' +
              programData.data.foto2;

        reactotron.log('Masuk Program Acara');
      }

      updTrack = {
        id: currentTrack.id,
        title: title,
        artist: artist,
        url: currentTrack.url,
        artwork: imgart,
        urlWeb: currentTrack.urlWeb,
        apiUrl: currentTrack.apiUrl,
        duration: time,
      };

      reactotron.log('Kosong', {
        artist: artist,
        title: title,
        artwork: imgart,
      });
    } else {
      updTrack = yield axios
        .get(`https://itunes.apple.com/search?term=${artist}-${title}&limit=2`)
        .then((respJson) => {
          if (respJson.data.resultCount == '0') {
            imgart = currentTrack.artwork;
          } else {
            var ResultData = respJson.data.results[0];
            imgart = ResultData.artworkUrl100.replace(/100x100/, '1024x1024');
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

      reactotron.log('Isi', {
        artist: artist,
        title: title,
        artwork: imgart,
      });
    }

    // TrackPlayer.updateMetadataForTrack(currentTrack.id, {
    //   artist: artist,
    //   title: title,
    //   artwork: imgart,
    //   duration: time,
    // });

    reactotron.log('Waktu Delay : ' + Math.round(time * 1000));

    yield put(PlayerActions.setTrackSuccess(updTrack));
    yield delay(Math.round(time * 1000));
  }

  // try {
  //   while (isStream) {
  //     let artist = '';
  //     let title = '';
  //     let imgart = null;
  //     let time = 10;
  //     const programData = yield call(getProgram);
  //     let updTrack = null;

  //     time = yield call(getTime);

  //     yield axios.get(`${currentTrack.apiUrl}/nowplaying`).then(res => {
  //       artist = res.data.song_artist;
  //       title = res.data.song_title;
  //       imgart = currentTrack.artwork;

  //       updTrack = {
  //         id: currentTrack.id,
  //         title: title,
  //         artist: artist,
  //         url: currentTrack.url,
  //         artwork: imgart,
  //         urlWeb: currentTrack.urlWeb,
  //         apiUrl: currentTrack.apiUrl,
  //         duration: time,
  //       };
  //     });

  //     if (title === '' && artist === '') {
  //       let program = programData.data;

  //       // reactotron.log('Nama Program Acara ', program);

  //       if (typeof program.nama_program === 'undefined') {
  //         title = currentTrack.title;
  //         artist = currentTrack.artist;
  //         imgart = currentTrack.artwork;
  //       } else {
  //         title =
  //           program.data.nama_program === ''
  //             ? currentTrack.title
  //             : program.data.nama_program;
  //         artist =
  //           program.data.dj === ''
  //             ? currentTrack.artist
  //             : program.data.dj2 === ''
  //             ? program.data.dj
  //             : program.data.dj + ' & ' + program.data.dj2;
  //         imgart =
  //           program.data.foto2 === ''
  //             ? currentTrack.artwork
  //             : 'https://www.' +
  //               currentTrack.urlWeb +
  //               '/assets/program_image/' +
  //               program.data.foto2;
  //       }

  //       updTrack = {
  //         id: currentTrack.id,
  //         title: title,
  //         artist: artist,
  //         url: currentTrack.url,
  //         artwork: imgart,
  //         urlWeb: currentTrack.urlWeb,
  //         apiUrl: currentTrack.apiUrl,
  //         duration: time,
  //       };

  //       reactotron.log('Kosong', {
  //         artist: artist,
  //         title: title,
  //         artwork: imgart,
  //       });
  //     } else {
  //       updTrack = yield axios
  //         .get(
  //           `https://itunes.apple.com/search?term=${artist}-${title}&limit=2`,
  //         )
  //         .then(respJson => {
  //           if (respJson.data.resultCount == '0') {
  //             imgart = currentTrack.artwork;
  //           } else {
  //             var ResultData = respJson.data.results[0];
  //             imgart = ResultData.artworkUrl100.replace(/100x100/, '1024x1024');
  //           }

  //           return {
  //             id: currentTrack.id,
  //             title: title,
  //             artist: artist,
  //             url: currentTrack.url,
  //             artwork: imgart,
  //             urlWeb: currentTrack.urlWeb,
  //             apiUrl: currentTrack.apiUrl,
  //             duration: time,
  //           };
  //         });

  //       reactotron.log('Isi', {
  //         artist: artist,
  //         title: title,
  //         artwork: imgart,
  //       });
  //     }

  //     TrackPlayer.updateMetadataForTrack(currentTrack.id, {
  //       artist: artist,
  //       title: title,
  //       artwork: imgart,
  //       duration: time,
  //     });

  //     reactotron.log('Waktu Delay : ' + Math.round(time * 1000));

  //     yield put(PlayerActions.setTrackSuccess(updTrack));
  //     yield delay(Math.round(time * 1000));
  //   }
  // } catch (error) {
  //   Platform.OS == 'android' &&
  //     ToastAndroid.show(
  //       "Can't get Meta data from server " +
  //         error.message +
  //         ', Please check you connection or Exit the App',
  //       ToastAndroid.SHORT,
  //     );

  //   reactotron.log(
  //     "Can't get Meta data from server " +
  //       error.message +
  //       ', Please check you connection or Exit the App',
  //   );

  //   yield put(PlayerActions.setTrackSuccess(currentTrack));
  // } finally {
  //   if (yield cancelled()) {
  //     reactotron.log('Berhenti streaming !');
  //   }
  // }
}

function* getProgram() {
  const currentTrack = yield select((state) => state.player.track);
  let rData = {};

  return yield axios
    .get(`${currentTrack.apiUrl}/program/current`)
    .then((Response) => {
      if (Response.data.day === '') {
        // eslint-disable-next-line dot-notation
        rData = currentTrack;
      } else {
        rData = Response.data;
      }

      return rData;
    })
    .catch((err) => {
      reactotron.log('Failed at Backend !', err);

      rData = currentTrack;

      // reactotron.log('Default Value', rData);

      return rData;
    });
  // try {
  //   return yield axios
  //     .get(`${currentTrack.apiUrl}/program/current`)
  //     .then(Response => {
  //       if (Response.data.day === '') {
  //         // eslint-disable-next-line dot-notation
  //         rData = currentTrack;
  //       } else {
  //         rData = Response.data;
  //       }

  //       return rData;
  //     });
  // } catch (err) {
  //   reactotron.log('Failed at Backend !', err);

  //   rData = currentTrack;

  //   // reactotron.log('Default Value', rData);

  //   return rData;
  // }
}

function* getTime() {
  const currentTrack = yield select((state) => state.player.track);

  // try {
  //   yield axios.get(`${currentTrack.apiUrl}/nowplaying`).then(Response => {
  //     let timeDiff =
  //       Response.data.time_diff == '0' ? 10 : Response.data.time_diff;

  //     return timeDiff;
  //   });
  // } catch (err) {
  //   reactotron.log('Get Time', err);
  // } finally {
  //   return 10;
  // }

  return yield axios
    .get(`${currentTrack.apiUrl}/nowplaying`)
    .then((Response) => {
      if (Response.data.time_current == '') {
        return 60;
      } else {
        return Response.data.time_diff == '0'
          ? 10
          : Response.data.time_diff > 200
          ? 195
          : Response.data.time_diff;
      }
    });
}

function* runTasks() {
  const isStream = yield select((state) => state.player.is_stream);

  while (isStream) {
    // starts the task in the background
    const bgSyncTask = yield fork(fetchData);

    // wait for the user stop action
    yield take('STOP');
    // user clicked stop. cancel the background task
    // this will cause the forked bgSync task to jump into its finally block
    yield cancel(bgSyncTask);
  }
}

function* findDefault() {
  const curTrack = yield call(TrackPlayer.getCurrentTrack);
  const radioChannel = [
    {
      id: 'cityradio',
      title: '95.9 City Radio',
      artist: 'City',
      url: 'https://sc.cityradio.id/',
      // url: 'https://20673.live.streamtheworld.com/KISS_92AAC.aac',
      // @ts-ignore
      artwork: require('@images/city_fm_square.jpg'),
      urlWeb: 'cityradio.id/5.0',
      apiUrl: 'https://api.cityradio.id/api',
      duration: 100,
    },
    {
      id: 'citymandarin',
      title: '95.9 City Radio',
      artist: 'City Mandarin',
      url: 'https://digital.cityradio.id/',
      // url: 'https://20673.live.streamtheworld.com/ONE_FM_913AAC.aac',
      // @ts-ignore
      artwork: require('@images/city_mandarin_square.jpg'),
      urlWeb: 'cityradio.id/5.0',
      apiUrl: 'https://api.cityradio.id/api/mandarin',
      duration: 100,
    },
    {
      id: 'medanfm',
      title: '96.3 Medan FM',
      artist: 'Medan FM',
      url: 'https://sc.medanfm.id/',
      // @ts-ignore
      artwork: require('@images/medan_fm_square.jpg'),
      urlWeb: 'medanfm.id/2017',
      apiUrl: 'https://api.medanfm.id/api',
      duration: 100,
    },
  ];

  const defChannel =
    Array.isArray(radioChannel) && radioChannel.find((el) => el.id == curTrack);

  return defChannel;
}

function* updMetaData(metaData) {
  const currentTrack = yield select((state) => state.player.track);

  let artist = metaData.artist;
  let title = metaData.title.substring(0, metaData.title.indexOf(' -'));
  let imgart = null;
  // let time = 10;
  const programData = yield call(getProgram);
  let updTrack = null;

  const defData = yield call(findDefault);

  // reactotron.log('Meta Data Default', defData);

  if (title === '' || artist === '') {
    // reactotron.log('Nama Program Acara ', programData.data);

    if (typeof programData.data === 'undefined') {
      title = defData.title;
      artist = defData.artist;
      imgart = defData.artwork;

      reactotron.log('Masuk Kosong / Error');
    } else {
      title =
        programData.data.nama_program === ''
          ? defData.title
          : programData.data.nama_program;
      artist =
        programData.data.nama_program === ''
          ? defData.artist
          : programData.data.dj2 === ''
          ? programData.data.dj
          : programData.data.dj + ' & ' + programData.data.dj2;
      imgart =
        programData.data.nama_program === ''
          ? defData.artwork
          : 'https://www.' +
            defData.urlWeb +
            '/assets/program_image/' +
            programData.data.foto2;
    }

    updTrack = {
      id: defData.id,
      title: title,
      artist: artist,
      url: defData.url,
      artwork: imgart,
      urlWeb: defData.urlWeb,
      apiUrl: defData.apiUrl,
    };

    reactotron.log('Kosong', {
      artist: artist,
      title: title,
      artwork: imgart,
    });
  } else {
    updTrack = yield axios
      .get(`https://itunes.apple.com/search?term=${artist}-${title}&limit=2`)
      .then((respJson) => {
        if (respJson.data.resultCount == '0') {
          imgart = defData.artwork;
        } else {
          var ResultData = respJson.data.results[0];
          imgart = ResultData.artworkUrl100.replace(/100x100/, '1024x1024');
        }

        return {
          id: defData.id,
          title: title,
          artist: artist,
          url: defData.url,
          artwork: imgart,
          urlWeb: defData.urlWeb,
          apiUrl: defData.apiUrl,
        };
      });

    reactotron.log('Isi', {
      artist: artist,
      title: title,
      artwork: imgart,
    });
  }

  TrackPlayer.updateMetadataForTrack(currentTrack.id, {
    title: title,
    artist: artist,
    artwork: imgart,
  });

  yield put(PlayerActions.setTrackSuccess(updTrack));
}

export function* setPodcast({podcast, podcastId}) {
  const currentPodcast = yield select((state) => state.player.podcast);

  // yield call(init, false);

  if (!currentPodcast || podcastId !== currentPodcast.id) {
    if (Platform.OS == 'android') {
      yield call(TrackPlayer.stop);
      yield call(TrackPlayer.reset);
    } else {
      yield call(TrackPlayer.pause);
    }

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
  const player = yield select((state) => state.player);
  const currentIndex = player.podcast.tracks.findIndex(
    (episode) => episode.id === player.current,
  );

  if (player.podcast.tracks[currentIndex - 1]) {
    yield call(TrackPlayer.skipToPrevious);
    yield put(PlayerActions.play());
  }
}

export function* next() {
  const player = yield select((state) => state.player);
  const currentIndex = player.podcast.tracks.findIndex(
    (episode) => episode.id === player.current,
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
  const isFollow = yield select((state) => state.player.isFollowing);
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
