/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry, YellowBox, LogBox} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './src/App';
import {name as appName} from './app.json';
import player from '@services/player';

LogBox.ignoreLogs([
  'Warning: componentWillReceiveProps',
  'Require cycle:',
  'Setting a timer for a long period of time',
]);

// YellowBox.ignoreWarnings([
//   'Warning: componentWillReceiveProps',
//   'Require cycle',
//   'Deprecation warning: use moment',
//   'Setting a timer for a long period of time',
// ]);

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => player);
