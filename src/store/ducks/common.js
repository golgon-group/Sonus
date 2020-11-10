import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/**
 * Action Types & Creators
 */
const {Types, Creators} = createActions({
  setChannelRequest: ['value'],
  setChannelSuccess: ['value'],
  setSleep: ['time'],
  setSleepSuccess: ['time'],
  resetTimer: null,
  commonDestroy: null,
});

export const CommonTypes = Types;
export default Creators;

/**
 * Initial state
 */

export const INITIAL_STATE = Immutable({
  data: null,
  info: null,
  timeValue: 0,
});

/**
 * Reducers to types
 */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_CHANNEL_SUCCESS]: (state, {value}) =>
    state.merge({data: value.data, info: value}),
  [Types.SET_SLEEP_SUCCESS]: (state, {time}) => state.merge({timeValue: time}),
  [Types.RESET_TIMER]: (state) => state.merge({timeValue: 0}),
});
