// @ts-nocheck
import React from 'react';
import {Dimensions, View, StyleSheet, Platform} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PlayerActions from '~/store/ducks/player';

import {
  Container,
  BackButton,
  RightButton,
  CoverBackground,
  Block,
  EpisodeInfo,
  Title,
  Author,
  Controls,
  ControlButton,
  ControlIcon,
  Cover,
  ScrollList,
} from './styles';
import {Actions} from 'react-native-router-flux';
import ActionSheet from 'react-native-actionsheet';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import FastImage from 'react-native-fast-image';
import reactotron from 'reactotron-react-native';
import {ScrollView} from 'react-native';

const {height, width} = Dimensions.get('window');

function Player(props) {
  const {player, currentTrack, play, pause, prev, stop, next} = props;

  var coverImg =
    currentTrack.artwork.length > 5
      ? {uri: currentTrack.artwork}
      : currentTrack.artwork;

  // reactotron.log('Gambar : ', currentTrack.artwork);

  // var pl_title = currentTrack.title == null ? '' : currentTrack.title;
  // var pl_artist = currentTrack.artist == null ? '' : currentTrack.artist;

  return (
    player.current != null && (
      <ScrollList>
        <Container>
          <CoverBackground source={coverImg} />

          <View
            style={{
              position: 'absolute',
              left: 10,
              top: Platform.OS === 'ios' ? getStatusBarHeight() + 10 : 20,
              right: 10,
              // zIndex: 5,
            }}>
            <BackButton onPress={() => Actions.pop()}>
              <ControlIcon name="angle-down" family="font-awesome" size={32} />
            </BackButton>
            {/* <RightButton onPress={() => this.ActionSheet.show()}>
            <ControlIcon name="more-vert" family="material" size={32} />
          </RightButton> */}
          </View>

          {/* <Cover resizeMode={'contain'} source={currentTrack.artwork} /> */}
          <View style={{marginTop: 50}}>
            <FastImage
              source={coverImg}
              resizeMode={'contain'}
              style={{width: width, height: width}}
            />
          </View>
          <EpisodeInfo>
            <Title>{currentTrack.title}</Title>
            <Author>{currentTrack.artist}</Author>
          </EpisodeInfo>

          <Controls stream={player.is_stream}>
            {!player.is_stream && (
              <ControlButton onPress={prev}>
                <ControlIcon name="skip-previous" family="material" size={32} />
              </ControlButton>
            )}
            <ControlButton
              onPress={() => {
                // player.playing ? (player.is_stream ? stop : pause) : play;
                if (player.playing) {
                  if (player.is_stream) {
                    Actions.pop();
                    setTimeout(() => {
                      stop();
                    }, 500);
                  } else {
                    pause();
                  }
                } else {
                  play();
                }
              }}>
              <ControlIcon
                name={
                  player.playing
                    ? player.is_stream
                      ? 'stop'
                      : 'pause'
                    : 'play'
                }
                family="fontisto"
                size={32}
              />
            </ControlButton>
            {!player.is_stream && (
              <ControlButton onPress={next}>
                <ControlIcon name="skip-next" family="material" size={32} />
              </ControlButton>
            )}
          </Controls>

          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title={'Which one do you like ?'}
            options={[
              'Cancel',
              'Add to Playlist',
              'Add to Queue',
              'View Album',
              'View Artist',
              'Share',
            ]}
            cancelButtonIndex={0}
            destructiveButtonIndex={0}
            onPress={index => {
              /* do something */
            }}
          />
        </Container>
      </ScrollList>
    )
  );
}

const mapStateToProps = state => ({
  player: state.player,
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
)(Player);
