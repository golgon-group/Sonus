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
  FlatList,
  Platform,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import FastImage from 'react-native-fast-image';

import TrackPlayer from 'react-native-track-player';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
  Container,
  ScrollList,
  HeadTitles,
  ChannelId,
  ChannelTitles,
} from './styles';

import {Theme, Fonts} from '~/constants';
import {Slider, Icon} from '~/components';

import PlayerActions from '~/store/ducks/player';
import reactotron from 'reactotron-react-native';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';

import {AdMobBanner} from 'react-native-admob';

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

const AndroidChannel = [
  {
    name: 'City Radio Regular',
    // @ts-ignore
    image: require('~/assets/images/city_fm.jpg'),
    data: {
      id: 'cityradio',
      title: '95.9 City Radio',
      artist: 'City',
      url: 'https://live.cityradio.id/cityradio.ogg',
      // url: 'https://20673.live.streamtheworld.com/KISS_92AAC.aac',
      // @ts-ignore
      artwork: require('~/assets/images/city_fm_square.jpg'),
      urlWeb: 'cityradio.id/5.0',
      apiUrl: 'https://api.cityradio.id/api',
      duration: 100,
    },
  },
  {
    name: 'City Radio Mandarin',
    // @ts-ignore
    image: require('~/assets/images/city_fm_mandarin.jpg'),
    data: {
      id: 'citymandarin',
      title: '95.9 City Radio',
      artist: 'City Mandarin',
      url: 'https://live.cityradio.id/cr-mandarin.ogg',
      // url: 'https://live.cityradio.id/cr-mandarin.ogg',
      // @ts-ignore
      artwork: require('~/assets/images/city_mandarin_square.jpg'),
      urlWeb: 'cityradio.id/5.0',
      apiUrl: 'https://api.cityradio.id/api/mandarin',
      duration: 100,
    },
  },
  {
    name: 'Medan FM',
    // @ts-ignore
    image: require('~/assets/images/medan_fm.jpg'),
    data: {
      id: 'medanfm',
      title: '96.3 Medan FM',
      artist: 'Medan FM',
      url: 'https://live.medanfm.id/medanfm.ogg',
      // @ts-ignore
      artwork: require('~/assets/images/medan_fm_square.jpg'),
      urlWeb: 'medanfm.id/2017',
      apiUrl: 'https://api.medanfm.id/api',
      duration: 100,
    },
  },
];

const iOSChannel = [
  {
    name: 'City Radio Regular',
    // @ts-ignore
    image: require('~/assets/images/city_fm.jpg'),
    data: {
      id: 'cityradio',
      title: '95.9 City Radio',
      artist: 'City',
      url: 'https://sc.cityradio.id/',
      // url: 'https://20673.live.streamtheworld.com/KISS_92AAC.aac',
      // @ts-ignore
      artwork: require('~/assets/images/city_fm_square.jpg'),
      urlWeb: 'cityradio.id/5.0',
      apiUrl: 'https://api.cityradio.id/api',
      duration: 100,
    },
  },
  {
    name: 'City Radio Mandarin',
    // @ts-ignore
    image: require('~/assets/images/city_fm_mandarin.jpg'),
    data: {
      id: 'citymandarin',
      title: '95.9 City Radio',
      artist: 'City Mandarin',
      url: 'https://digital.cityradio.id/',
      // url: 'https://20673.live.streamtheworld.com/ONE_FM_913AAC.aac',
      // @ts-ignore
      artwork: require('~/assets/images/city_mandarin_square.jpg'),
      urlWeb: 'cityradio.id/5.0',
      apiUrl: 'https://api.cityradio.id/api/mandarin',
      duration: 100,
    },
  },
  {
    name: 'Medan FM',
    // @ts-ignore
    image: require('~/assets/images/medan_fm.jpg'),
    data: {
      id: 'medanfm',
      title: '96.3 Medan FM',
      artist: 'Medan FM',
      url: 'https://sc.medanfm.id/',
      // @ts-ignore
      artwork: require('~/assets/images/medan_fm_square.jpg'),
      urlWeb: 'medanfm.id/2017',
      apiUrl: 'https://api.medanfm.id/api',
      duration: 100,
    },
  },
];

class Main extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerLeft: <View style={{flex: 1}} />,
  });

  componentDidMount() {}

  handlePlay = track => {
    const {setTrackRequest} = this.props;

    setTrackRequest(track, track.id);
  };

  render() {
    const {currentTrack, play, pause, stop} = this.props;
    // const radioChannel = Platform.OS == 'android' ? AndroidChannel : iOSChannel;

    const radioChannel = iOSChannel;

    return (
      <Container>
        <StatusBar hidden={false} barStyle={'light-content'} />
        <ScrollList>
          <View style={{marginTop: 10, marginLeft: 10}}>
            <HeadTitles>Channels</HeadTitles>
          </View>
          <FlatList
            style={{marginTop: 20}}
            data={radioChannel}
            contentContainerStyle={{flex: 1, alignItems: 'center'}}
            ItemSeparatorComponent={() => (
              <View style={{height: 20, backgroundColor: 'transparent'}} />
            )}
            renderItem={({item, index}) => {
              return (
                <ChannelId
                  onPress={
                    currentTrack && item.data.id === currentTrack.id
                      ? stop
                      : () => this.handlePlay(item.data)
                  }>
                  <View style={styles.htBoxBackground}>
                    <FastImage
                      style={styles.chImage}
                      source={item.image}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    <View style={styles.chIcon}>
                      <Icon
                        name={
                          currentTrack && item.data.id === currentTrack.id
                            ? 'stop'
                            : 'play'
                        }
                        family={'font-awesome'}
                        size={width >= 500 ? 32 : 18}
                        color={Theme.COLORS.WHITE}
                      />
                    </View>
                  </View>
                  <ChannelTitles>{item.name}</ChannelTitles>
                </ChannelId>
              );
            }}
            keyExtractor={item => item.data.id}
          />
          <View
            style={{
              flex: 1,
              marginTop: '5%',
              marginBottom: '5%',
              alignItems: 'center',
            }}>
            <AdMobBanner
              adSize="banner"
              adUnitID={
                __DEV__
                  ? 'ca-app-pub-3940256099942544/6300978111'
                  : Platform.OS == 'android'
                  ? 'ca-app-pub-3255099610255589/6895397132'
                  : 'ca-app-pub-3255099610255589/1709840446'
              }
              testDevices={[AdMobBanner.simulatorId]}
              // @ts-ignore
              onAdFailedToLoad={error => reactotron.error(error)}
            />
          </View>
          {/* <View style={{backgroundColor: '#FFF', height: 5}} />
          <View style={{flex: 1, marginTop: 10}}>
            <View
              style={{
                backgroundColor: '#D5D8DC',
                justifyContent: 'center',
                alignItems: 'center',
                height: 75,
              }}>
              <Text style={{color: '#273746'}}>Reserved for Banner Ads</Text>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
            <View
              style={{
                backgroundColor: '#D5D8DC',
                justifyContent: 'center',
                alignItems: 'center',
                width: width / 3,
                height: 150,
              }}>
              <Text style={{color: '#273746'}}>Reserved for Vendor Ads</Text>
            </View>
            <View style={{width: width * 0.03}} />
            <View
              style={{
                backgroundColor: '#D5D8DC',
                justifyContent: 'center',
                alignItems: 'center',
                width: width / 3,
                height: 150,
              }}>
              <Text style={{color: '#273746'}}>Reserved for Vendor Ads</Text>
            </View>
          </View> */}
          {/* <View style={{flex: 1, marginTop: 20}}>
            <Slider title="Recently Podcast" keyword="recent" />
          </View>
          <View style={{flex: 1, marginTop: 20}}>
            <Slider title="Popular Podcast" keyword="popular" />
          </View>
          <View style={{flex: 1, marginTop: 20}}>
            <Slider title="New Release For You" keyword="release" />
          </View> */}
        </ScrollList>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  // headTitlesText: { marginTop: 10, fontFamily: Fonts.FONTS.DEFAULT, fontSize: 15, color: Theme.COLORS.WHITE },
  htBoxBackground: {
    width: '100%',
    height: width >= 500 ? height / 3 : height / 3.5 - 50,
    backgroundColor: Theme.COLORS.WHITE,
    // borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chImage: {width: '100%', height: '100%'},
  chIcon: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    backgroundColor: 'rgba(20, 20, 20, .5)',
    // borderColor: Theme.COLORS.BORDER,
    borderRadius: width >= 500 ? 64 / 2 : 36 / 2,
    height: width >= 500 ? 64 : 36,
    width: width >= 500 ? 64 : 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  player: state.player,
  currentTrack: state.player.track,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(PlayerActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
