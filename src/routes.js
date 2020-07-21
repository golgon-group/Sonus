// @ts-nocheck
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import {StackViewStyleInterpolator} from 'react-navigation-stack';
import {
  Scene,
  Router,
  Actions,
  Reducer,
  ActionConst,
  Overlay,
  Lightbox,
  Stack,
  Modal,
  Drawer,
} from 'react-native-router-flux';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PlayerActions from '~/store/ducks/player';

// other imports...
import {Theme, Fonts} from '~/constants';
import {DrawerContent, Icon} from '~/components';
import Miniplayer from '~/components/MiniPlayer';
import Player from '~/components/Player';

// Pages
import Intro from '~/pages/appintro';

import Auth from '~/pages/Auth';
import Main from '~/pages/Main';
import Podcast from '~/pages/Podcast';

import Profile from '~/pages/Profile';
import Notification from '~/pages/Notification';
import Playlist from '~/pages/Playlist';
import Reward from '~/pages/Reward';
// End Pages

import reactotron from 'reactotron-react-native';
import RNMinimizeApp from 'react-native-minimize';

// on Android, the URI prefix typically contains a host in addition to scheme
const prefix = Platform.OS === 'android' ? 'mychat://mychat/' : 'mychat://';

const MyTransitionSpec = {
  duration: 300,
  // easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
  // timing: Animated.timing,
};

const transitionConfig = () => ({
  transitionSpec: MyTransitionSpec,
  // screenInterpolator: StackViewStyleInterpolator.forVertical,
  screenInterpolator: props => {
    // StackViewStyleInterpolator.forVertical,
    switch (props.scene.route.params.direction) {
      case 'vertical':
        return StackViewStyleInterpolator.forVertical(props);
      case 'fade':
        return StackViewStyleInterpolator.forFade(props);
      case 'none':
        return StackViewStyleInterpolator.forInitial;
      case 'horizontal':
        return StackViewStyleInterpolator.forHorizontal(props);
    }
  },
});

class Routes extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    dispatch: PropTypes.func,
    firstTime: PropTypes.bool,
  };

  _renderLeftButton = () => {
    return (
      <TouchableOpacity style={{marginLeft: 10}} onPress={() => Actions.pop()}>
        <Icon
          name={'angle-left'}
          family={'font-awesome'}
          color={'white'}
          size={24}
        />
      </TouchableOpacity>
    );
  };

  _renderRightButton = () => {
    return (
      <TouchableOpacity
        style={{marginRight: 20}}
        onPress={() => this._handleIconTouch()}>
        <Icon
          name={'ios-search'}
          family={'ionicon'}
          size={18}
          color={Theme.COLORS.WHITE}
        />
      </TouchableOpacity>
    );
  };

  _handleIconTouch = () => {
    Alert.alert('You try search things !');
  };

  reducerCreate(params) {
    const defaultReducer = Reducer(params);
    return (state, action) => {
      this.props.dispatch(action);
      return defaultReducer(state, action);
    };
  }

  render() {
    const {player, currentTrack, stop} = this.props;
    return (
      <Router
        createReducer={this.reducerCreate.bind(this)}
        navigationBarStyle={styles.navBar}
        sceneStyle={styles.scene}
        uriPrefix={prefix}
        backAndroidHandler={() => {
          let cs = Actions.currentScene;
          // ToastAndroid.show('Current Scene : '+cs, ToastAndroid.SHORT)
          // let isOpen = Actions.;
          // Actions.pop();
          if (cs === 'login' || cs === '_home' || cs === 'home') {
            reactotron.log('Current Scene : ' + cs);
            //   // reactotron.log('Drawer Cond : ' + JSON.stringify(isOpen));
            if (this.lastBackButtonPress + 2000 >= new Date().getTime()) {
              if (currentTrack && !player.playing) {
                reactotron.log('No Player is playing !');
                return true;
              } else {
                // @ts-ignore
                // BackHandler.exitApp();
                RNMinimizeApp.minimizeApp();
                return true;
              }
            }
            Actions.drawerClose();

            ToastAndroid.show(
              "Tekan 'kembali' lagi untuk keluar",
              ToastAndroid.SHORT,
            );
            this.lastBackButtonPress = new Date().getTime();
            return true;
          }
          // else {
          //   Actions.pop();
          // }
        }}
        titleStyle={styles.navTitle}
        headerLayoutPreset="center"
        headerTintColor={Theme.COLORS.WHITE}>
        <Overlay key="overlay">
          <Modal key="modal" transitionConfig={transitionConfig}>
            <Scene
              key="intro"
              // @ts-ignore
              type={ActionConst.RESET}
              hideNavBar
              component={Intro}
              title="Intro"
              initial={this.props.firstTime}
            />
            {/* <Scene
              key="login"
              // @ts-ignore
              type={ActionConst.RESET}
              hideNavBar
              component={Auth}
              title="Login"
              direction="fade"
              initial={!this.props.firstTime}
            />
            <Drawer
              hideNavBar
              key="drawer"
              onExit={() => {
                console.log('Drawer closed');
              }}
              onEnter={() => {
                console.log('Drawer opened');
              }}
              type={ActionConst.RESET}
              contentComponent={DrawerContent}
              drawerIcon={() => (
                <Icon
                  name={'md-reorder'}
                  family={'ionicon'}
                  size={24}
                  color={Theme.COLORS.WHITE}
                />
              )}
              drawerWidth={300}
              direction="fade">
              <Scene
                key="home"
                component={Main}
                title="SONUS"
                // renderRightButton={this._renderRightButton}
              />
            </Drawer> */}
            <Scene
              key="home"
              initial={!this.props.firstTime}
              component={Main}
              title="SONUS"
              renderLeftButton={() => null}
              type={ActionConst.RESET}
              // renderRightButton={this._renderRightButton}
            />
            {/* <Stack
              key="profile"
              direction="horizontal"
              title="PROFILE"
              titleStyle={styles.navTitle}>
              <Scene
                key="profile_1"
                component={Profile}
                hideNavBar
                renderBackButton={this._renderLeftButton}
              />
            </Stack>
            <Stack
              key="notification"
              direction="horizontal"
              title="NOTIFICATION"
              titleStyle={styles.navTitle}>
              <Scene
                key="notification_1"
                component={Notification}
                hideNavBar
                renderBackButton={this._renderLeftButton}
              />
            </Stack>
            <Stack
              key="playlist"
              direction="horizontal"
              title="PLAYLIST"
              titleStyle={styles.navTitle}>
              <Scene
                key="playlist_1"
                component={Playlist}
                hideNavBar
                renderBackButton={this._renderLeftButton}
              />
            </Stack>
            <Stack
              key="reward"
              direction="horizontal"
              title="REWARD"
              titleStyle={styles.navTitle}>
              <Scene
                key="reward_1"
                component={Reward}
                hideNavBar
                renderBackButton={this._renderLeftButton}
              />
            </Stack>
            <Scene
              key="podcast"
              component={Podcast}
              hideNavBar
              renderBackButton={this._renderLeftButton}
              direction="horizontal"
            /> */}
            <Scene
              key="player"
              hideNavBar
              component={Player}
              direction="vertical"
            />
          </Modal>
        </Overlay>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scene: {
    // backgroundColor: Theme.COLORS.WHITE,
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  tabBarStyle: {
    backgroundColor: '#eee',
  },
  tabBarSelectedItemStyle: {
    backgroundColor: '#ddd',
  },
  navBar: {
    backgroundColor: Theme.COLORS.BLACK,
  },
  navTitle: {
    color: Theme.COLORS.WHITE,
    fontSize: 20,
    fontFamily: Fonts.FONTS.NAVBAR_TITLE,
  },
});

export default connect()(Routes);

// export default connect()(Routes);
