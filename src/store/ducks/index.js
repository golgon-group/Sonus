import {combineReducers} from 'redux';

import {reducer as player} from './player';
// import {reducer as routes} from './routes';

import routes from './routes';

export default combineReducers({
  player,
  routes,
});
