import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  I18nManager,
  Dimensions,
  StatusBar,
} from 'react-native';
import {Icon} from '~/components';
import AppIntroSlider from 'react-native-app-intro-slider';

import {Actions} from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';
import {Fonts} from '~/constants';

I18nManager.forceRTL(false);

const {width, height} = Dimensions.get('window');
const slides = [
  {
    key: 'scene1',
    title: 'STREAMING CHANNEL FAVORIT KAMU',
    text: 'Streaming channel radio favorit kamu kini lebih mudah dengan SONUS',
    // @ts-ignore
    image: require('~/assets/images/17200.jpg'),
  },
  // {
  //   key: 'scene2',
  //   title: 'PODCAST TERBARU',
  //   text: 'Nikmati beragam podcast terbaru dari podcaster terbaik Indonesia.',
  //   // @ts-ignore
  //   image: require('~/assets/images/339.jpg'),
  //   backgroundColor: '#0F0C29',
  // },
  // {
  //   key: 'scene3',
  //   title: 'DAPATKAN REWARDS',
  //   text: 'Kumpulkan poin dan dapatkan hadiah & penawaran menarik.',
  //   // @ts-ignore
  //   image: require('~/assets/images/OC1PEB0.jpg'),
  //   backgroundColor: '#0F0C29',
  // },
];

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showRealApp: false,
    };
  }

  _renderItem = ({item}) => {
    return (
      <View style={styles.mainContent}>
        <FastImage
          style={styles.imgCover}
          source={item.image}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text style={[styles.txtStyle, styles.title]}>{item.title}</Text>
        <Text style={[styles.txtStyle, styles.sub]}>{item.text}</Text>
      </View>
    );
  };

  _renderPrevButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          family={'ionicon'}
          name={'md-arrow-round-back'}
          color={'rgba(255, 255, 255, .9)'}
          size={24}
          style={{backgroundColor: 'transparent'}}
        />
      </View>
    );
  };

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          family={'ionicon'}
          name={'md-arrow-round-forward'}
          color={'rgba(255, 255, 255, .9)'}
          size={24}
          style={{backgroundColor: 'transparent'}}
        />
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          family={'ionicon'}
          name={'md-checkmark'}
          color={'rgba(255, 255, 255, .9)'}
          size={width >= 500 ? 32 : 24}
          style={{backgroundColor: 'transparent'}}
        />
      </View>
    );
  };

  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({showRealApp: true}, () => {
      AsyncStorage.setItem('FirstTime', 'false');
      // AsyncStorage.clear();
      Actions.home();
    });
  };

  render() {
    if (this.state.showRealApp) {
      return <App />;
    } else {
      return (
        <View style={{flex: 1}}>
          <StatusBar hidden />
          <AppIntroSlider
            slides={slides}
            renderItem={this._renderItem}
            renderPrevButton={this._renderPrevButton}
            renderDoneButton={this._renderDoneButton}
            renderNextButton={this._renderNextButton}
            onDone={this._onDone}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    // alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingBottom: 90,
    height: '100%',
    zIndex: 1,
    backgroundColor: '#0F0C29',
  },
  imgCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  txtStyle: {
    flexWrap: 'wrap',
    marginLeft: width * 0.08832,
    marginRight: width * 0.08832,
    paddingHorizontal: 20,

    color: '#FFF',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  title: {
    fontSize: width >= 500 ? 32 : 24,
    fontFamily: Fonts.FONTS.I_Title,
  },
  sub: {
    fontSize: width >= 500 ? 20 : 14,
    fontFamily: Fonts.FONTS.I_Sub,
  },
  buttonCircle: {
    width: width >= 500 ? 60 : 40,
    height: width >= 500 ? 60 : 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: width >= 500 ? 30 : 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
