/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import FastImage from 'react-native-fast-image';

import TrackPlayer from 'react-native-track-player';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Container, ScrollList, HeadTitles, ChannelId} from './styles';

import {Theme, Fonts} from '~/constants';
import {Slider, Icon} from '~/components';

import PlayerActions from '~/store/ducks/player';
import reactotron from 'reactotron-react-native';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';

const {width, height} = Dimensions.get('window');

const MyLoader = () => (
  <ContentLoader
    height={height}
    width={width}
    speed={1}
    primaryColor="#202020"
    secondaryColor="#454545">
    <Rect x="5" y="15" rx="5" ry="5" width="200" height="20" />
    <Rect
      x="5"
      y="55"
      rx="10"
      ry="10"
      width={(width - 30) / 2}
      height={(width - 30) / 2}
    />
    <Rect
      x="235"
      y="55"
      rx="10"
      ry="10"
      width={(width - 30) / 2}
      height={(width - 30) / 2}
    />
    <Rect x="5" y="320" rx="5" ry="5" width="200" height="20" />
    <Rect
      x="5"
      y="350"
      rx="10"
      ry="10"
      width={Math.ceil((width - 70) / 2.5)}
      height={Math.ceil((width + 30) / 2.5)}
    />
    <Rect
      x="195"
      y="350"
      rx="10"
      ry="10"
      width={Math.ceil((width - 70) / 2.5)}
      height={Math.ceil((width + 30) / 2.5)}
    />
    <Rect
      x="385"
      y="350"
      rx="10"
      ry="10"
      width={Math.ceil((width - 70) / 2.5)}
      height={Math.ceil((width + 30) / 2.5)}
    />
  </ContentLoader>
);

const radioChannel = [
  {
    name: 'City Radio FM',
    image: 'CityRadio.png',
    data: {
      id: 'cityradio',
      title: '95.9 City Radio',
      artist: 'City',
      url: 'http://live.cityradio.id:9590/',
      artwork: 'http://cityradio.id/5.0/assets/img/city_logo_web.png',
    },
  },
  {
    name: 'City Mandarin FM',
    image: 'CityRadio.png',
    data: {
      id: 'citymandarin',
      title: '95.9 City Radio',
      artist: 'City',
      url: 'http://live.cityradio.id:9590/',
      artwork: 'http://cityradio.id/5.0/assets/img/city_logo_web.png',
    },
  },
  {
    name: 'Medan FM',
    image: 'MedanFM.png',
    data: {
      id: 'medanfm',
      title: '96.3 Medan FM',
      artist: 'Medan FM',
      url: 'http://streaming.medanfm.id:9630/',
      artwork: 'https://medanfm.id/2017/assets/img/logo.png',
    },
  },
];

class Main extends Component {
  componentDidMount() {}

  handlePlay = track => {
    const {setTrackRequest} = this.props;

    setTrackRequest(track, track.id);
  };

  render() {
    return (
      <Container>
        <ScrollList>
          <View style={{marginTop: 20}}>
            <HeadTitles>Channels</HeadTitles>
          </View>
          <ScrollView
            style={{marginTop: 20}}
            horizontal
            // automaticallyAdjustContentInsets={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'space-between',
            }}>
            <ChannelId onPress={() => this.handlePlay('cityradio')}>
              <View style={styles.htBoxBackground}>
                <FastImage
                  style={styles.chImage}
                  // @ts-ignore
                  source={require('~/assets/images/CityRadio.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <View style={styles.chIcon}>
                  <Icon
                    name={'play'}
                    family={'font-awesome'}
                    size={18}
                    color={Theme.COLORS.WHITE}
                  />
                </View>
              </View>
              <HeadTitles>City FM</HeadTitles>
            </ChannelId>
            <ChannelId onPress={() => this.handlePlay('cityradio')}>
              <View style={styles.htBoxBackground}>
                <FastImage
                  style={styles.chImage}
                  // @ts-ignore
                  source={require('~/assets/images/CityRadio.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <View style={styles.chIcon}>
                  <Icon
                    name={'play'}
                    family={'font-awesome'}
                    size={18}
                    color={Theme.COLORS.WHITE}
                  />
                </View>
              </View>
              <HeadTitles>City Mandarin FM</HeadTitles>
            </ChannelId>
            <ChannelId onPress={() => this.handlePlay('medanfm')}>
              <View style={styles.htBoxBackground}>
                <FastImage
                  style={styles.chImage}
                  // @ts-ignore
                  source={require('~/assets/images/MedanFM.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <View style={styles.chIcon}>
                  <Icon
                    name={'play'}
                    family={'font-awesome'}
                    size={18}
                    color={Theme.COLORS.WHITE}
                  />
                </View>
              </View>
              <HeadTitles>Medan FM</HeadTitles>
            </ChannelId>
          </ScrollView>
          <View style={{flex: 1, marginTop: 20}}>
            <Slider title="Recently Podcast" keyword="recent" />
          </View>
          <View style={{flex: 1, marginTop: 20}}>
            <Slider title="Popular Podcast" keyword="popular" />
          </View>
          <View style={{flex: 1, marginTop: 20}}>
            <Slider title="New Release For You" keyword="release" />
          </View>
        </ScrollList>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  // headTitlesText: { marginTop: 10, fontFamily: Fonts.FONTS.DEFAULT, fontSize: 15, color: Theme.COLORS.WHITE },
  htBoxBackground: {
    width: '100%',
    height: 151,
    backgroundColor: Theme.COLORS.WHITE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chImage: {width: 129, height: 77},
  chIcon: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(19, 19, 19, .2)',
    // borderColor: Theme.COLORS.BORDER,
    borderRadius: 36 / 2,
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  currentTrack: state.player.track,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(PlayerActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
