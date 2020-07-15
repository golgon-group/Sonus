/**
 * @format
 */

import {AppRegistry, YellowBox} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './src';
// @ts-ignore
import {name as appName} from './app.json';
import player from '~/services/player';

YellowBox.ignoreWarnings([
  'Warning: componentWillReceiveProps',
  'Require cycle',
  'Deprecation warning: use moment',
  'Setting a timer for a long period of time',
]);

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => player);
