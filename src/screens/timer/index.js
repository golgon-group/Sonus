import React, {Component, useState} from 'react';
import {
  View,
  Text,
  Switch,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {Icon} from 'react-native-elements';
import reactotron from 'reactotron-react-native';

import Slider from '@react-native-community/slider';
import CircleSlider from '@components/CircleSlider';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CommonActions from '@store/ducks/common';

const {width, height} = Dimensions.get('window');

function Timer(props) {
  const {navigation, info, timeValue, setSleep} = props;
  const [valueTime, setValueTime] = useState(0);

  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const Radius = Math.ceil(width * 0.08);

  React.useEffect(() => {}, [timeValue]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setValueTime(timeValue);
    });

    setValueTime(timeValue);

    return unsubscribe;
  }, [navigation, timeValue]);

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View
        style={{
          width: width * 0.8,
          flexDirection: 'row',
          marginTop: 30,
          zIndex: 10,
        }}>
        <Text
          style={{
            width: (width * 0.8) / 2,
            fontSize: 20,
            fontFamily: 'ProximaNova-Extrabld',
          }}>
          Sleep Timer
        </Text>
        <Switch
          style={{marginLeft: (width * 0.6) / 2}}
          trackColor={{false: '#767577', true: '#D7DBDD'}}
          thumbColor={isEnabled ? info.data.themeColor : '#f4f3f4'}
          ios_backgroundColor="#767577"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <View style={{width: width * 0.8, marginTop: 10}}>
        <Text style={{fontSize: 12, fontFamily: 'ProximaNova-Regular'}}>
          Adjust the knob to set a countdown duration for the sleep timer.
        </Text>
      </View>
      <View style={styles.timerContainer}>
        <Text
          style={{
            fontFamily: 'ProximaNova-Extrabld',
            fontSize: 32,
          }}>
          {valueTime} MIN
        </Text>
      </View>
      <View style={styles.timerContainer}>
        <CircleSlider
          disabled={!isEnabled}
          meterColor={!isEnabled ? '#767577' : info.data.themeColor}
          strokeColor={'#ABB2B9'}
          strokeWidth={Radius}
          dialRadius={Math.round(width * 0.35)}
          dialWidth={Radius}
          btnRadius={Radius - 10}
          iconSize={Radius}
          value={valueTime}
          onValueChange={(value) => setValueTime(value)}
          runSleep={(time) => setSleep(time)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    position: 'absolute',
    paddingTop: width > 400 ? 0 : 20,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

const mapStateToProps = (state) => ({
  info: state.common.info,
  timeValue: state.common.timeValue,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(CommonActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
