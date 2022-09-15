import React, {Component, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image as RNImage,
} from 'react-native';

import {connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import AuthActions from '@store/ducks/auth';
import PlayerActions from '@store/ducks/player';

import reactotron from 'reactotron-react-native';
import {Image, Icon} from 'react-native-elements';

const {height, width} = Dimensions.get('window');

const sizing = width > 400 ? 72 : 48;
const imgWidthSizing =
  width <= 400 ? 70 : width >= 401 && width <= 450 ? 30 : 0;
const imgHeightSizing =
  height <= 640 ? 40 : height >= 640 && height <= 700 ? 10 : 0;

function Player(props) {
  const {
    navigation,
    route,
    common,
    player,
    currentTrack,
    play,
    pause,
    stop,
    dislike,
    like,
    isLiked,
    setTrackRequest,
    setShowRequest,
  } = props;

  const track = common.data;

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!player.playing) {
        setShowRequest(track);
      }
    });

    if (!player.playing) {
      setShowRequest(track);
    }

    return unsubscribe;
    // if (currentTrack.id !== track.id) {
    //   setShowRequest(track);
    // }
  }, [navigation, setShowRequest, track, player.playing]);

  var coverImg =
    player.current != null
      ? currentTrack.artwork.length > 5
        ? {uri: currentTrack.artwork}
        : currentTrack.artwork
      : common.data.artwork;

  return (
    player.current != null && (
      <View style={styles.container}>
        <View style={[styles.cover, styles.shadow]}>
          <RNImage
            source={coverImg}
            resizeMethod={'scale'}
            resizeMode={
              player.current != null && currentTrack.artwork.length > 5
                ? 'contain'
                : 'stretch'
            }
            style={styles.ImgCover}
          />
          {/* <Image
            source={coverImg}
            resizeMode={
              player.current != null && currentTrack.artwork.length > 5
                ? 'contain'
                : 'stretch'
            }
            style={{
              width: width - imgWidthSizing - imgHeightSizing,
              height: width - imgWidthSizing - imgHeightSizing,
              borderColor: 'rgba(52, 52, 52, 0.2)',
              borderWidth: 0.5,
            }}
          /> */}
        </View>
        <View style={styles.episodeInfo}>
          <Text
            style={[styles.title, styles.textShadow]}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {currentTrack.title}
          </Text>
          <Text style={[styles.author, styles.textShadow]}>
            {currentTrack.artist}
          </Text>
          {/* <Text>
            Screen Width {width + '\n'} Screen Height {height}
          </Text> */}
        </View>
        <View
          style={[
            styles.controls,
            {
              justifyContent:
                !currentTrack.isEmpty && currentTrack.id != 'citymandarin'
                  ? 'space-between'
                  : 'center',
            },
          ]}>
          {!currentTrack.isEmpty && currentTrack.id != 'citymandarin' && (
            <TouchableOpacity
              style={styles.styleDislike}
              hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}
              onPress={() => {
                like();
              }}>
              <Icon
                name={'not-interested'}
                type={'material'}
                size={32}
                color={'#000'}
              />
            </TouchableOpacity>
          )}
          {player.is_loading ? (
            <ActivityIndicator
              style={styles.styleBtn}
              size={'large'}
              color={currentTrack.themeColor}
            />
          ) : (
            <TouchableOpacity
              style={styles.styleBtn}
              onPress={() => {
                // player.playing ? (player.is_stream ? stop : pause) : play;
                if (player.playing) {
                  // if (player.is_stream) {
                  //   stop();
                  // } else {
                  //   pause();
                  // }
                  pause();
                } else {
                  setTrackRequest(track, track.id);
                }
              }}
              hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}>
              <Icon
                name={player.playing ? 'ios-pause-circle' : 'ios-play-circle'}
                type={'ionicon'}
                size={sizing}
                color={track.themeColor}
              />
            </TouchableOpacity>
          )}
          {!currentTrack.isEmpty && currentTrack.id != 'citymandarin' && (
            <TouchableOpacity
              style={styles.styleLike}
              hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}
              onPress={() => {
                like();
              }}>
              <Icon
                name={isLiked ? 'heart' : 'heart-outline'}
                type={'material-community'}
                size={32}
                color={isLiked ? '#E74C3C' : '#000'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height,
    width,
    backgroundColor: '#FFF',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textShadow: {
    textShadowColor: 'rgba(52, 52, 52, 0.2)',
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 1.41,
  },
  cover: {
    marginTop: 30,
    // marginHorizontal: 80,
    alignItems: 'center',
  },
  ImgCover: {
    width: width - imgWidthSizing - imgHeightSizing,
    height: width - imgWidthSizing - imgHeightSizing,
    borderColor: 'rgba(52, 52, 52, 0.2)',
    borderWidth: 0.5,
  },
  episodeInfo: {
    marginLeft: 20,
    marginTop: 10,
    marginRight: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: width >= 500 ? 40 : width <= 400 ? 22 : 34,
    fontFamily: 'ProximaNova-Bold',
    textAlign: 'center',
    textShadowColor: '#000',
    color: '#000',
  },
  author: {
    fontSize: width >= 500 ? 34 : width <= 400 ? 16 : 28,
    fontFamily: 'ProximaNova-Regular',
    textShadowColor: '#000',
    color: '#000',
    marginTop: 3,
  },
  controls: {
    position: 'absolute',
    bottom: '7%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    width: '100%',
    // marginTop: '7%',
    paddingLeft: '10%',
    paddingRight: '10%',
    alignItems: 'center',
  },
  styleDislike: {
    height: sizing,
    width: sizing,
    borderRadius: sizing / 2,
    // backgroundColor: 'rgba(86, 101, 115, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleBtn: {
    height: sizing,
    width: sizing,
    borderRadius: sizing / 2,
    // backgroundColor: 'rgba(86, 101, 115, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleLike: {
    height: sizing,
    width: sizing,
    borderRadius: sizing / 2,
    // backgroundColor: 'rgba(86, 101, 115, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => ({
  player: state.player,
  common: state.common,
  currentTrack: state.player.podcast
    ? state.player.podcast.tracks.find(
        (episode) => episode.id === state.player.current,
      )
    : state.player.track,
  isLiked: state.player.isLiked,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(Object.assign({}, AuthActions, PlayerActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Player);
