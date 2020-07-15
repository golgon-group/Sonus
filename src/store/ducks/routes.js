import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';
import reactotron from 'reactotron-react-native';
import {ActionConst} from 'react-native-router-flux';

export const INITIAL_STATE = Immutable({
  scene: null,
});

export default function reducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    // focus action is dispatched when a new screen comes into focus
    case ActionConst.FOCUS:
      // reactotron.log(
      //   'Tipe : ' +
      //     action.type +
      //     ' Action Const : ' +
      //     ActionConst.FOCUS +
      //     ' Scene : ' +
      //     state.scene,
      // );
      return {
        scene: action.routeName,
      };
    // ...other actions
    default:
      return state;
  }
}

// export const INITIAL_STATE = Immutable({
//   scene: null,
// });

// /**
//  * Reducers to types
//  */
// export const reducer = createReducer(INITIAL_STATE, {
//   [ActionConst.FOCUS]: (state, {action}) =>
//     state.merge({scene: action.routeName}),
// });
