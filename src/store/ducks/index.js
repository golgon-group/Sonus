import {combineReducers} from 'redux';

import {reducer as player} from './player';
import {reducer as common} from './common';
import {reducer as favorit} from './favorit';
import {reducer as auth} from './auth';

// import routes from './routes';

const appReducer = combineReducers({
  player,
  common,
  favorit,
  auth,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_USER_SUCCESS') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
