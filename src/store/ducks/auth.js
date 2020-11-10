import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/**
 * Action Types & Creators
 */
const {Types, Creators} = createActions({
  loginUserRequest: ['method'],
  loginUserSuccess: ['method'],
  getUserRequest: null,
  getUserSuccess: ['user'],
  logoutUserRequest: null,
  logoutUserSuccess: null,
});

export const AuthTypes = Types;
export default Creators;

/**
 * Initial state
 */

export const INITIAL_STATE = Immutable({
  user: null,
  loginMethod: null,
});

/**
 * Reducers to types
 */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_USER_SUCCESS]: (state, {method}) =>
    state.merge({loginMethod: method}),
  [Types.GET_USER_SUCCESS]: (state, {user}) =>
    state.merge({user: user.providerData[0]}),
  [Types.LOGOUT_USER_SUCCESS]: (state) =>
    state.merge({user: null, loginMethod: null}),
});
