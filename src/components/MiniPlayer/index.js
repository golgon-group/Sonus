import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

import TrackPlayer from 'react-native-track-player';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import reactotron from 'reactotron-react-native';

import PlayerActions from '~/store/ducks/player';

import {Theme, Fonts} from '~/constants';
import {Icon} from '~/components';

import {ControlIcon} from './styles';
import {Actions} from 'react-native-router-flux';

const {width, height} = Dimensions.get('window');

function Miniplayer(props) {
  const {player, routes, currentTrack, play, pause, stop, next} = props;

  // const mp_title = player.current ? currentTrack.title : '';
  // const mp_artist = player.current ? currentTrack.artist : '';

  return (
    player.current &&
    routes.scene !== 'player' && (
      <View style={[styles.card]}>
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() => {
            Actions.player();
          }}>
          <View style={styles.expand}>
            <Icon
              name={'angle-up'}
              family={'font-awesome'}
              size={width >= 500 ? 44 : 32}
              color={Theme.COLORS.WHITE}
            />
          </View>
          <View style={styles.info}>
            <Text numberOfLines={2} ellipsizeMode={'tail'} style={styles.title}>
              {/* {mp_title} - {mp_artist} */}
              {currentTrack.title} - {currentTrack.artist}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButtonContainer}
            onPress={player.playing ? (player.is_stream ? stop : pause) : play}>
            <ControlIcon
              name={
                player.playing
                  ? player.is_stream
                    ? 'stop-circle-outline'
                    : 'pause-circle-outline'
                  : 'play-circle-outline'
              }
              family={'material-community'}
              size={width >= 500 ? 44 : 32}
            />
          </TouchableOpacity>
          {!player.is_stream && (
            <TouchableOpacity
              style={styles.controlButtonContainer}
              onPress={next}>
              <ControlIcon
                name={'skip-next'}
                family={'material-community'}
                size={width >= 500 ? 44 : 32}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  card: {
    height: Math.ceil(height * 0.0865),
    flexDirection: 'row',
    backgroundColor: Theme.COLORS.BLACK,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'white',
    zIndex: 50,
  },
  btnContainer: {
    width: '80%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  expand: {
    width: '10%',
    marginLeft: 10,
    justifyContent: 'center',
  },
  info: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: width >= 500 ? 24 : 14,
    fontFamily: Fonts.FONTS.Label,
    color: Theme.COLORS.WHITE,
  },
  controls: {
    width: '20%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  controlButtonContainer: {
    margin: 5,
  },
  controlButtonText: {
    fontSize: width >= 500 ? 28 : 18,
    textAlign: 'center',
    color: Theme.COLORS.WHITE,
  },
});

const mapStateToProps = state => ({
  player: state.player,
  routes: state.routes,
  currentTrack: state.player.podcast
    ? state.player.podcast.tracks.find(
        episode => episode.id === state.player.current,
      )
    : state.player.track,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(PlayerActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Miniplayer);
