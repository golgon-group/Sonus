import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/**
 * Action Types & Creators
 */
const {Types, Creators} = createActions({
  setRankRequest: ['currentChannel'],
  setRankSuccess: ['value'],
});

export const FavoritTypes = Types;
export default Creators;

/**
 * Initial state
 */

export const INITIAL_STATE = Immutable({
  fav_data: null,
  fav_info: null,
});

/**
 * Reducers to types
 */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_RANK_SUCCESS]: (state, {value}) => state.merge({fav_data: value}),
});
