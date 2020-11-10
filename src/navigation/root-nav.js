import React, {useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Platform,
  ToastAndroid,
} from 'react-native';

import {Icon, Image} from 'react-native-elements';

import {getStatusBarHeight} from 'react-native-status-bar-height';

import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {rootSwitch} from '@config/navigator';

import HomeTab from './home-tab';
import AuthStack from './auth-stack';

import Loading from '@screens/loading';
import Choose from '@screens/choose';

import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  MenuProvider,
  renderers,
} from 'react-native-popup-menu';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AuthActions from '@store/ducks/auth';
import CommonActions from '@store/ducks/common';
import PlayerActions from '@store/ducks/player';

import NavigationService from '@utils/navigation';

import reactotron from 'reactotron-react-native';

const {width, height} = Dimensions.get('window');

const Stack = createStackNavigator();

const {Popover, SlideInMenu, ContextMenu} = renderers;

const SonusChannel = [
  {
    name: 'City Radio 95.9 FM',
    image: require('@images/CityRadio.png'),
    data: {
      id: 'cityradio',
      title: '95.9 City Radio',
      artist: 'City',
      url: 'https://sc.cityradio.id/',
      artwork: require('@images/city_fm_square.jpg'),
      urlWeb: 'cityradio.id/5.0',
      apiUrl: 'https://api.cityradio.id/api',
      duration: 100,
      themeColor: '#E0752F',
      isEmpty: true,
    },
    whatsapp: '0819888959',
    email: 'info@cityradio959fm.co.id',
    instagram: 'https://www.instagram.com/city959fm',
    facebook: 'https://www.facebook.com/city959fm',
    twitter: 'https://twitter.com/city959fm',
    youtube: 'https://www.youtube.com/channel/UCC7XmyJJCs_XYlZtExL3TTw',
  },
  {
    name: 'City Mandarin 95.9 FM',
    image: require('@images/CityMandarin.png'),
    data: {
      id: 'citymandarin',
      title: '95.9 City Radio',
      artist: 'City Mandarin',
      url: 'https://digital.cityradio.id/',
      artwork: require('@images/city_mandarin_square.jpg'),
      urlWeb: 'cityradio.id/5.0',
      apiUrl: 'https://api.cityradio.id/api/mandarin',
      duration: 100,
      themeColor: '#E0752F',
      isEmpty: true,
    },
    whatsapp: '0819888959',
    email: 'info@cityradio959fm.co.id',
    instagram: 'https://www.instagram.com/city959fm',
    facebook: 'https://www.facebook.com/city959fm',
    twitter: 'https://twitter.com/city959fm',
    youtube: 'https://www.youtube.com/channel/UCC7XmyJJCs_XYlZtExL3TTw',
  },
  {
    name: '96.3 Medan FM Studio',
    image: require('@images/MedanFM.png'),
    data: {
      id: 'medanfm',
      title: '96.3 Medan FM',
      artist: 'Medan FM',
      url: 'https://sc.medanfm.id/',
      artwork: require('@images/medan_fm_square.jpg'),
      urlWeb: 'medanfm.id/2017',
      apiUrl: 'https://api.medanfm.id/api',
      duration: 100,
      themeColor: '#209746',
      isEmpty: true,
    },
    whatsapp: '0819889630',
    email: 'info@963medanfm.com',
    instagram: 'https://www.instagram.com/963medanfm',
    facebook: 'https://www.facebook.com/963MedanFM',
    twitter: 'https://twitter.com/963medanfm',
    youtube: 'https://www.youtube.com/channel/UCPL9ABhTAMFTZwdG9g11lsA',
  },
];

let lastBackButtonPress = 0;

function onBackPress(instance) {
  if (instance.isMenuOpen()) {
    reactotron.log(
      `Back button was pressed. Current menu state: ${
        instance.isMenuOpen() ? 'opened' : 'closed'
      }`,
    );
    return true;
  } else {
    if (lastBackButtonPress + 2000 >= new Date().getTime()) {
      BackHandler.exitApp();
      return true;
    }

    Platform.OS == 'android' &&
      ToastAndroid.show(
        "Tekan 'kembali' lagi untuk keluar",
        ToastAndroid.SHORT,
      );

    lastBackButtonPress = new Date().getTime();
    return true;
  }
}

function RadioMenu(props) {
  // const dmenu = React.useRef();

  const [iconName, setIcon] = useState('chevron-down');
  const {
    common,
    setChannelRequest,
    getUserRequest,
    user,
    info,
    player,
    stop,
  } = props;

  function findChannel(strChannel) {
    const channel =
      Array.isArray(SonusChannel) &&
      SonusChannel.find((el) => el.data.id == strChannel);

    if (player.current != null && player.playing) {
      stop();
    }

    setChannelRequest(channel);
  }

  const channelName = common.data && common.data.id;

  React.useEffect(() => {
    getUserRequest();
  }, [getUserRequest]);

  return (
    <Menu
      // ref={dmenu}
      renderer={Popover}
      onOpen={() => {
        setIcon('chevron-up');
      }}
      onClose={() => {
        setIcon('chevron-down');
      }}
      rendererProps={{
        preferredPlacements: 'bottom',
        anchorStyle: {marginLeft: width * 0.3},
      }}>
      <MenuTrigger
        customStyles={{
          triggerWrapper: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}>
        {user && common.data ? (
          <Image
            style={{width: 128, height: 60}}
            source={info.image}
            resizeMode={'contain'}
          />
        ) : (
          <Text style={{fontFamily: 'ProximaNova-Regular', fontSize: 24}}>
            Choose Radio
          </Text>
        )}
        <Icon
          type={'material-community'}
          name={iconName}
          size={34}
          color={'#2C3E50'}
        />
      </MenuTrigger>
      <MenuOptions customStyles={{optionsContainer: {borderRadius: 10}}}>
        <MenuOption
          customStyles={{
            optionWrapper: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
              marginRight: 10,
            },
          }}
          onSelect={() => findChannel('cityradio')}>
          <Image
            style={{
              width: width * 0.5,
              height: width * 0.2,
            }}
            source={require('@images/CityRadio.png')}
            resizeMode={'contain'}
          />
          <View style={{width: width * 0.3}} />
          <Icon
            type={'feather'}
            name={channelName === 'cityradio' ? 'check-circle' : 'circle'}
            size={24}
            color={
              channelName === 'cityradio' ? common.data.themeColor : '#BFC9CA'
            }
          />
        </MenuOption>
        <MenuOption
          customStyles={{
            optionWrapper: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
              marginRight: 10,
            },
          }}
          onSelect={() => findChannel('citymandarin')}>
          <Image
            style={{
              width: width * 0.5,
              height: width * 0.2,
            }}
            source={require('@images/CityMandarin.png')}
            resizeMode={'contain'}
          />
          <View style={{width: width * 0.3}} />
          <Icon
            type={'feather'}
            name={channelName === 'citymandarin' ? 'check-circle' : 'circle'}
            size={24}
            color={
              channelName === 'citymandarin'
                ? common.data.themeColor
                : '#BFC9CA'
            }
          />
        </MenuOption>
        <MenuOption
          customStyles={{
            optionWrapper: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
              marginRight: 10,
            },
          }}
          onSelect={() => findChannel('medanfm')}>
          <Image
            style={{
              width: width * 0.5,
              height: width * 0.2,
            }}
            source={require('@images/MedanFM.png')}
            resizeMode={'contain'}
          />
          <View style={{width: width * 0.3}} />
          <Icon
            type={'feather'}
            name={channelName === 'medanfm' ? 'check-circle' : 'circle'}
            size={24}
            color={
              channelName === 'medanfm' ? common.data.themeColor : '#BFC9CA'
            }
          />
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
}

function Logout(props) {
  const {logoutUserRequest, info} = props;
  return (
    <TouchableOpacity
      style={{marginRight: 10}}
      onPress={() => logoutUserRequest()}>
      <Icon
        type={'material-community'}
        name={'logout'}
        size={24}
        color={info ? info.data.themeColor : '#3498DB'}
      />
    </TouchableOpacity>
  );
}

function rootNav(props) {
  return (
    <MenuProvider
      customStyles={{
        backdrop: {
          backgroundColor: '#000',
          opacity: 0.5,
        },
      }}
      style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      backHandler={true}>
      <NavigationContainer
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}>
        <Stack.Navigator
          initialRouteName={rootSwitch.loading}
          screenOptions={(navigation, route) => ({
            gestureEnabled: false,
            headerStyle: {
              elevation: 0.5,
              shadowOpacity: 0.7,
            },
            headerTitleAlign: 'center',
            headerTitle: () => (
              <RadioMenu {...props} {...navigation} {...route} />
            ),
            headerRight: () => <Logout {...props} {...navigation} {...route} />,
          })}>
          <Stack.Screen
            name={rootSwitch.loading}
            component={Loading}
            options={{
              header: () => null,
            }}
            initialParams={props}
          />
          <Stack.Screen
            name={rootSwitch.auth}
            component={AuthStack}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={rootSwitch.choose}
            component={Choose}
            options={{
              headerLeft: null,
            }}
          />
          <Stack.Screen name={rootSwitch.main} component={HomeTab} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}

const mapStateToProps = (state) => ({
  player: state.player,
  common: state.common,
  info: state.common.info,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    Object.assign({}, AuthActions, CommonActions, PlayerActions),
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(rootNav);
