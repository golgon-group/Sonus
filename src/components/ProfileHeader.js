import React from 'react';
import {View, Text, StyleSheet, StatusBar, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-navigation';

// import {StreamApp} from 'expo-activity-feed';
// import Count from './Count';
// import {Avatar} from 'expo-activity-feed';
import CoverImage from './CoverImage';
import Avatar from './Avatar';
import reactotron from 'reactotron-react-native';
import {Fonts} from '~/constants';
// import type {FollowCounts} from 'getstream';
// import type {AppCtx} from 'expo-activity-feed';
// import type {UserData} from '../types';

const {width, height} = Dimensions.get('window');

class ProfileHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        following_count: 0,
        followers_count: 0,
      },
    };
  }

  async componentDidMount() {
    // let data = await this.props.user.profile();
    // this.props.changedUserData();
    // this.setState({user: data});
  }

  getFontSize = (baseSize, textLength) => {
    if (textLength >= baseSize) {
      return (textLength = baseSize - textLength * 0.05);
    }

    const fontSize = baseSize - textLength;
    return fontSize;
  };

  render() {
    let {following_count, followers_count} = this.state.user;
    let {nama_depan, nama_belakang, username, desc, profileImage, coverImage} =
      this.props.userData || {};

    let fullName = nama_depan + ' ' + nama_belakang;

    coverImage ? StatusBar.setBarStyle('light-content', true) : null;

    return (
      <SafeAreaView style={[styles.profileHeader]}>
        <CoverImage source={coverImage} />

        <View style={[styles.mainSection]}>
          <View style={styles.userDetails}>
            <Text
              style={[
                styles.userName,
                {fontSize: this.getFontSize(39, fullName.length)},
              ]}>
              {fullName}
            </Text>
            <Text style={styles.userUrl}>@{username}</Text>
            <Text
              numberOfLines={5}
              style={[
                styles.userDesc,
                {fontSize: this.getFontSize(20, desc.length)},
              ]}>
              {desc}
            </Text>
          </View>
          <Avatar source={profileImage} size={100} />
        </View>

        {/* <View style={styles.statSection}>
          <Count num={following_count}>Followers</Count>
          <Count num={followers_count}>Following</Count>
        </View> */}
      </SafeAreaView>
    );
  }
}

const margin = 15;

const styles = StyleSheet.create({
  profileHeader: {
    backgroundColor: '#000000',
    paddingBottom: margin,
    width: 100 + '%',
  },
  profileHeaderShadow: {
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  mainSection: {
    width: 100 + '%',
    height: 150,
    marginTop: 90,
    marginBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  userDetails: {
    flex: 1,
    marginRight: 120,
  },
  userName: {
    fontSize: 39,
    fontFamily: Fonts.FONTS.SECONDARY,
    // color: '#364047',
    color: '#fff',

    textShadowColor: '#364047',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  userUrl: {
    fontSize: 11,
    fontFamily: Fonts.FONTS.PRIMARY,
    // color: '#364047',
    color: '#fff',

    textShadowColor: '#364047',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  userDesc: {
    lineHeight: 15,
    marginTop: 7,

    fontSize: 14,
    fontFamily: Fonts.FONTS.DESC,
    // color: '#364047',
    color: '#fff',

    textShadowColor: '#364047',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  statSection: {
    paddingLeft: margin * 2,
    paddingRight: margin,
    flexDirection: 'row',
  },
});

export default ProfileHeader;
