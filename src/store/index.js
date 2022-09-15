import {createStore, compose, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './ducks';
import rootSaga from './sagas';
import reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {seamlessImmutableTransformCreator} from 'redux-persist-seamless-immutable';
import {persistReducer, persistStore} from 'redux-persist';
import ImmutablePersistenceTransform from './ImmutablePersistenceTransform';

const persistConfig = {
  key: 'root',
  // transform: [seamlessImmutableTransformCreator()],
  transforms: [ImmutablePersistenceTransform],
  storage: AsyncStorage,
  blacklist: ['player'],
  timeout: 0,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares = [];

const sagaMonitor = __DEV__ ? console.tron.createSagaMonitor() : null;

const sagaMiddleware = createSagaMiddleware({sagaMonitor});

middlewares.push(sagaMiddleware);

const composer = __DEV__
  ? compose(applyMiddleware(...middlewares), console.tron.createEnhancer())
  : compose(applyMiddleware(...middlewares));

const store = createStore(persistedReducer, composer);
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export {store, persistor};
export default store;

// export default () => {
//   const composer = __DEV__
//     ? compose(applyMiddleware(...middlewares), console.tron.createEnhancer())
//     : compose(applyMiddleware(...middlewares));

//   const store = createStore(persistedReducer, composer);
//   const persistor = persistStore(store);

//   sagaMiddleware.run(rootSaga);
//   return {store, persistor};
// };
