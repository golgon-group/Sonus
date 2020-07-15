import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ViewPropTypes,
  ImageBackground,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import {Actions} from 'react-native-router-flux';

import AsyncStorage from '@react-native-community/async-storage';

// import ipconfig from './config';
import {Icon} from '~/components';
import {Theme, Fonts} from '~/constants';

// import statusCodes along with GoogleSignin
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';

import auth from '@react-native-firebase/auth';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PlayerActions from '~/store/ducks/player';

import reactotron from 'reactotron-react-native';

const {height, width} = Dimensions.get('window');

const isIos = Platform.OS === 'ios';
const isIphoneX = isIos && Dimensions.get('window').height === 812;
const isIphoneXS = isIos && Dimensions.get('window').height >= 812;

const HOME_ACTIVITY_INDICATOR = isIphoneX ? 24 : 0;
const APPBAR_HEIGHT =
  isIos && Dimensions.get('window').height === 812 ? 34 : 20;

class DrawerContent extends React.Component {
  constructor(props) {
    super(props);
    // this._isMounted = false;

    this.state = {
      imgUrl: 'user',
      user: '',
      nama_user: '',
      hak_user: '',
    };
  }

  static propTypes = {
    name: PropTypes.string,
    sceneStyle: ViewPropTypes.style,
    title: PropTypes.string,
  };

  static contextTypes = {
    drawer: PropTypes.object,
  };

  componentDidMount() {
    // this._isMounted = true;
    // AsyncStorage.getItem('user_name', (error, result) => {
    //   if (result) {
    //     this.setState({
    //       nama_user: result,
    //     });
    //   }
    // });

    // AsyncStorage.getItem('roles', (error, result) => {
    //   if (result) {
    //     this.setState({
    //       hak_user: result,
    //     });
    //   }
    // });

    this._currentUser();
  }

  componentWillUnmount() {
    // this._isMounted = false;

    this.setState({
      imgUrl: 'user',
      user: '',
      nama_user: '',
      hak_user: '',
    });
  }

  _currentUser = async () => {
    var user = await auth().currentUser;

    if (user) {
      this.setState({
        user,
      });

      reactotron.log(user);
    } else {
      ToastAndroid.show(
        'User is not sign in, Signing out !',
        ToastAndroid.SHORT,
      );
      Actions.login();
      // No user is signed in.
    }
  };

  _signOut = async () => {
    const {player, stop} = this.props;
    player.playing && stop();
    await auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        reactotron.log('User signed out!');
        Actions.login({isSignOut: true});

        setTimeout(() => {
          this._removeToken();
        }, 2000);
      })
      .catch(function(error) {
        // An error happened
        reactotron.log(error);
      });
  };

  _removeToken = async () => {
    const {user} = this.state;

    // @ts-ignore
    await user.providerData.forEach(userInfo => {
      reactotron.log('User info for provider: ', userInfo);
      if (userInfo.providerId === 'google.com') {
        GoogleSignin.revokeAccess();
        GoogleSignin.signOut();
        this.setState({user: null});
      }
    });
  };

  render() {
    const {nama_user, hak_user, imgUrl} = this.state;
    const {player, stop} = this.props;

    return (
      <ScrollView style={styles.container}>
        <ImageBackground
          // @ts-ignore
          source={require('~/assets/images/bg_nav_top.png')}
          style={styles.imgbg}>
          <FastImage
            style={{
              width: 64,
              height: 64,
              borderRadius: 64 / 2,
              borderColor: '#FFF',
              borderWidth: 1,
            }}
            // @ts-ignore
            source={{uri: this.state.user.photoURL}}
            // source={{
            //   uri: props.uri,
            //   priority: FastImage.priority.normal,
            // }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text
            style={{
              marginTop: 20,
              color: Theme.COLORS.WHITE,
              fontFamily: Fonts.FONTS.SECONDARY,
              fontSize: 14,
            }}>
            Nama :{' '}
            {
              // @ts-ignore
              this.state.user.displayName
            }
          </Text>
          <Text
            style={{
              marginTop: 5,
              color: Theme.COLORS.WHITE,
              fontFamily: Fonts.FONTS.PRIMARY,
              fontSize: 14,
            }}>
            Email :{' '}
            {
              // @ts-ignore
              this.state.user.email
            }
          </Text>
        </ImageBackground>
        {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Actions.profile({
              onBack: () => {
                Actions.drawer();
              },
            });
          }}>
          <View style={{width: 26, height: 26}}>
            <Icon
              name={'user-circle'}
              family={'font-awesome'}
              size={24}
              color={Theme.COLORS.SECONDARY}
            />
          </View>
          <Text style={styles.menuLabel}>Profile</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Actions.notification({
              onBack: () => {
                Actions.drawer();
              },
            });
          }}>
          <View style={{width: 26, height: 26}}>
            <Icon
              name={'bell'}
              family={'font-awesome'}
              size={24}
              color={Theme.COLORS.SECONDARY}
            />
          </View>
          <Text style={styles.menuLabel}>Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Actions.playlist({
              onBack: () => {
                Actions.drawer();
              },
            });
          }}>
          <View style={{width: 26, height: 26}}>
            <Icon
              name={'playlist-music'}
              family={'material-community'}
              size={24}
              color={Theme.COLORS.SECONDARY}
            />
          </View>
          <Text style={styles.menuLabel}>Playlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Actions.reward({
              onBack: () => {
                Actions.drawer();
              },
            });
          }}>
          <View style={{width: 26, height: 26}}>
            <Icon
              name={'tag'}
              family={'font-awesome'}
              size={24}
              color={Theme.COLORS.SECONDARY}
            />
          </View>
          <Text style={styles.menuLabel}>Reward</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.menuItem} onPress={this._signOut}>
          <View style={{width: 26, height: 26}}>
            <Icon
              name={'logout'}
              family={'material-community'}
              size={24}
              color={Theme.COLORS.SECONDARY}
            />
          </View>
          <Text style={styles.menuLabel}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.COLORS.BLACK,
  },
  imgbg: {
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingTop: 10,
    height: Math.ceil(height / 4),
  },
  menuItem: {
    marginLeft: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    color: Theme.COLORS.WHITE,
  },
  menuLabel: {
    marginLeft: 20,
    fontSize: 12,
    color: Theme.COLORS.WHITE,
  },
});

const mapStateToProps = state => ({
  player: state.player,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(PlayerActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DrawerContent);
