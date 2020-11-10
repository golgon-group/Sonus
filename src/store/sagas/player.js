/**
 * react-native-track-player 1.2.3
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

import PlayerActions from '@store/ducks/player';

import reactotron from 'reactotron-react-native';
import axios from 'axios';
import {ToastAndroid, Platform} from 'react-native';

import NavigationService from '@utils/navigation';
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

      if (nextMeta.title !== null || nextMeta.artist !== null) {
        yield call(updMetaData, nextMeta);
      }
      // yield put(PlayerActions.setCurrent(nextTrack));
    }
  } finally {
    Metachannel.close();
  }
}

export function* init() {
  // yield call(TrackPlayer.setupPlayer, {
  //   waitForBuffer: true,
  // });

  TrackPlayer.setupPlayer({
    waitForBuffer: true,
  });

  TrackPlayer.updateOptions({
    stopWithApp: true,
    alwaysPauseOnInterruption: true,
    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      // TrackPlayer.CAPABILITY_PAUSE,
      // TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      // TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      TrackPlayer.CAPABILITY_PAUSE,
    ],
    notificationCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      // TrackPlayer.CAPABILITY_PAUSE,
      // TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      // TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      TrackPlayer.CAPABILITY_PAUSE,
    ],
    compactCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
    ],
  });

  TrackPlayer.addEventListener('playback-track-changed', reactotron.log);
  TrackPlayer.addEventListener('playback-state', reactotron.log);

  yield call(metadataChanged);
}

export function* setShows({track}) {
  let updTrack = {};
  let title, artist, imgart;
  yield axios
    .get(`${track.apiUrl}/program/current`)
    .then((res) => {
      const {data} = res.data;
      if (res.data.day !== '') {
        title = data.nama_program === '' ? track.title : data.nama_program;
        artist =
          data.nama_program === ''
            ? track.artist
            : data.dj2 === ''
            ? data.dj
            : data.dj + ' & ' + data.dj2;
        imgart =
          data.nama_program === ''
            ? track.artwork
            : 'https://www.' +
              track.urlWeb +
              '/assets/program_image/' +
              data.foto2;

        updTrack = {
          id: track.id,
          title: title,
          artist: artist,
          url: track.url,
          artwork: imgart,
          urlWeb: track.urlWeb,
          apiUrl: track.apiUrl,
          duration: track.duration,
          themeColor: track.themeColor,
          isEmpty: true,
        };
      }
    })
    .catch((err) => {
      reactotron.log('Failed at Backend !', err);
      updTrack = track;
    });

  yield put(PlayerActions.setShowSuccess(updTrack));
}

export function* setTrack({track, trackId}) {
  const currentTrack = yield select((state) => state.player.track);

  yield put(PlayerActions.setLoading());

  // if (!currentTrack || track.id !== currentTrack.id) {
  yield call(TrackPlayer.stop);
  yield call(TrackPlayer.reset);

  reactotron.log('Tambah Playlist', track);

  yield call(TrackPlayer.add, {
    id: track.id,
    url: track.url,
    title: track.title,
    artist: track.artist,
    artwork: track.artwork,
    duration: track.duration,
  });
  yield put(PlayerActions.setTrackSuccess(track));
  // }

  if (trackId) {
    yield call(TrackPlayer.skip, trackId);
    yield put(PlayerActions.setCurrent(trackId));
  }

  yield put(PlayerActions.play());

  yield call(trackChanged);
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
  let isIntro = false;
  let curMeta = metaData.title.split(' - ');

  let artist = metaData.artist;
  let title = metaData.title.substring(0, metaData.title.indexOf(' -'));
  let imgart = null;
  // let time = 10;
  const programData = yield call(getProgram);
  let updTrack = null;

  const defData = yield call(findDefault);

  reactotron.log('Meta Data Default', defData, metaData, curMeta);

  if (title === '' || artist === '') {
    reactotron.log('Nama Program Acara ', programData.data);

    if (typeof programData.data === undefined) {
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

    isIntro = true;

    updTrack = {
      id: defData.id,
      title: title,
      artist: artist,
      url: defData.url,
      artwork: imgart,
      urlWeb: defData.urlWeb,
      apiUrl: defData.apiUrl,
      isEmpty: true,
    };

    reactotron.log('Kosong', {
      artist: artist,
      title: title,
      artwork: imgart,
    });
  } else {
    try {
      updTrack = yield axios
        .get(`https://itunes.apple.com/search?term=${artist}-${title}`)
        .then((respJson) => {
          if (respJson.data.resultCount == '0') {
            imgart = defData.artwork;
          } else {
            var jsonRes = respJson.data.results;
            var resultData = null;
            // cek semua data berdasarkan artistName dan trackName
            for (var i = 0; i < jsonRes.length; i++) {
              if (i == 0) {
                resultData = jsonRes[i];
              }

              if (
                jsonRes[i].artistName == artist &&
                jsonRes[i].trackName == title
              ) {
                if (jsonRes[i].collectionName !== undefined) {
                  imgart = jsonRes[i].artworkUrl100.replace(
                    /100x100/,
                    '1200x1200',
                  );

                  break;
                } else {
                  imgart = jsonRes[i].artworkUrl100.replace(
                    /100x100/,
                    '1200x1200',
                  );
                }
                resultData = null;

                reactotron.log('Image', imgart);
              }
            }

            if (resultData) {
              imgart = resultData.artworkUrl100.replace(/100x100/, '1200x1200');
            }

            // imgart = jsonRes[0].artworkUrl100.replace(/100x100/, '1024x1024');
          }

          title = title.split(new RegExp(' / ')).join('');
          // title = title.split(new RegExp('/[?]/g')).join('');
          title = title.replace(/[?]/g, '');

          artist = artist.split(new RegExp(' / ')).join('');
          // artist = artist.split(new RegExp('/[?]/g')).join('');
          artist = artist.replace(/[?]/g, '');

          isIntro = false;

          return {
            id: defData.id,
            title: title,
            artist: artist,
            url: defData.url,
            artwork: imgart,
            urlWeb: defData.urlWeb,
            apiUrl: defData.apiUrl,
            isEmpty: false,
          };
        });

      reactotron.log('Isi', {
        artist: artist,
        title: title,
        artwork: imgart,
      });
    } catch (error) {
      updTrack = {
        id: defData.id,
        title: title,
        artist: artist,
        url: defData.url,
        artwork: defData.artwork,
        urlWeb: defData.urlWeb,
        apiUrl: defData.apiUrl,
      };

      reactotron.log('Error Metadata', {
        title: title,
        artist: artist,
        artwork: defData.artwork,
      });
    }
  }

  // imgart = "https://www.google.com/imgres?imgurl=https%3A%2F%2Fis3-ssl.mzstatic.com%2Fimage%2Fthumb%2FPurple113%2Fv4%2Ff1%2F20%2Fc1%2Ff120c14e-dc75-4bce-fcc8-0211b48d2319%2Fsource%2F512x512bb.jpg&imgrefurl=https%3A%2F%2Fappadvice.com%2Fapp%2Fsonus%2F1452454178&tbnid=z_3fb5EOi9gLRM&vet=12ahUKEwjLpcWV6uXsAhV3CrcAHX2RDQgQMygAegQIARAq..i&docid=fQyFnpb1EY5-6M&w=512&h=512&itg=1&q=sonus%20pt%20media%20angkasa&safe=strict&ved=2ahUKEwjLpcWV6uXsAhV3CrcAHX2RDQgQMygAegQIARAq";

  TrackPlayer.updateMetadataForTrack(currentTrack.id, {
    title: title,
    artist: artist,
    artwork: imgart,
  });

  yield put(PlayerActions.setTrackSuccess(updTrack));

  if (!isIntro) {
    yield call(getLike);
  }
}

function* getLike() {
  const currentTrack = yield select((state) => state.player.track);
  const currentUser = yield select((state) => state.auth.user);

  // reactotron.log('User Login', currentUser, currentTrack);

  let data = false;

  try {
    data = yield axios
      .get(
        `https://api.cityradio.id/v2/like/${currentTrack.id}/${currentTrack.artist}/${currentTrack.title}/${currentUser.email}`,
        {
          headers: {'sonus-apps-token': 'knksVZU27gkgRWM7nCL7WSc36xmqqUNj'},
        },
      )
      .then((respJson) => {
        if (respJson.data.success) {
          reactotron.log(respJson);
          return true;
        }
      });
  } catch (error) {
    reactotron.log(error);
    data = false;
  }

  yield put(PlayerActions.currentLiked(data));
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
  yield call(TrackPlayer.setVolume, 1);
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
  // if (Platform.OS == 'android') {
  //   yield call(TrackPlayer.stop);
  //   yield call(TrackPlayer.reset);
  // } else {
  //   yield call(TrackPlayer.pause);
  // }
  yield call(TrackPlayer.stop);
  yield call(TrackPlayer.reset);
}

export function* destroy() {
  yield call(TrackPlayer.destroy);
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

export function* like() {
  const currentTrack = yield select((state) => state.player.track);
  const currentUser = yield select((state) => state.auth.user);

  // reactotron.log('User Login', currentUser, currentTrack);

  let data = false;

  try {
    data = yield axios
      .post(
        'https://api.cityradio.id/v2/like',
        {
          station: currentTrack.id,
          artis: currentTrack.artist,
          judul: currentTrack.title,
          email: currentUser.email,
        },
        {
          headers: {'sonus-apps-token': 'knksVZU27gkgRWM7nCL7WSc36xmqqUNj'},
        },
      )
      .then((respJson) => {
        if (respJson.data.success) {
          reactotron.log(respJson);
          return true;
        }
      });
  } catch (error) {
    reactotron.log(error);
    data = false;
  }

  yield put(PlayerActions.currentLiked(data));
}

export function* dislike() {
  const currentTrack = yield select((state) => state.player.track);
  const currentUser = yield select((state) => state.auth.user);

  // reactotron.log('User Login', currentUser, currentTrack);

  let data = false;

  try {
    data = yield axios
      .post(
        'https://api.cityradio.id/v2/like',
        {
          station: currentTrack.id,
          artis: currentTrack.artist,
          judul: currentTrack.title,
          email: currentUser.email,
        },
        {
          headers: {'sonus-apps-token': 'knksVZU27gkgRWM7nCL7WSc36xmqqUNj'},
        },
      )
      .then((respJson) => {
        if (respJson.data.success) {
          reactotron.log(respJson);
          return true;
        }
      });
  } catch (error) {
    reactotron.log(error);
    data = false;
  }

  yield put(PlayerActions.currentLiked(data));
}
