import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/**
 * Action Types & Creators
 */
const {Types, Creators} = createActions({
  setTrackRequest: ['track', 'trackId'],
  setTrackSuccess: ['track'],
  setPodcastRequest: ['podcast', 'podcastId'],
  setPodcastSuccess: ['podcast'],
  setLoading: null,
  setCurrent: ['id'],
  play: null,
  pause: null,
  next: null,
  prev: null,
  stop: null,
  setFollowRequest: ['podcast'],
  setFollowSuccess: ['isFol'],
});

export const PlayerTypes = Types;
export default Creators;

/**
 * Initial state
 */

export const INITIAL_STATE = Immutable({
  podcast: null,
  track: null,
  current: null,
  playing: false,
  is_stream: false,
  is_loading: false,
  isFollowing: false,
});

/**
 * Reducers to types
 */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_TRACK_SUCCESS]: (state, {track}) =>
    state.merge({
      track,
      podcast: null,
      current: track.id,
      is_stream: true,
      is_loading: false,
    }),
  [Types.SET_PODCAST_SUCCESS]: (state, {podcast}) =>
    state.merge({
      podcast,
      track: null,
      current: podcast.tracks[0].id,
      is_stream: false,
      is_loading: false,
    }),
  [Types.SET_LOADING]: state => state.merge({is_loading: true}),
  [Types.SET_CURRENT]: (state, {id}) => state.merge({current: id}),
  [Types.PLAY]: state => state.merge({playing: true}),
  [Types.PAUSE]: state => state.merge({playing: false}),
  [Types.STOP]: state =>
    state.merge({
      track: null,
      podcast: null,
      current: null,
      is_stream: false,
      playing: false,
      is_loading: false,
    }),
  [Types.SET_FOLLOW_SUCCESS]: (state, {isFol}) =>
    state.merge({isFollowing: isFol}),
});
