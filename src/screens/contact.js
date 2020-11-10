import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Linking,
  TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CommonActions from '@store/ducks/common';
import {Icon} from 'react-native-elements';
import reactotron from 'reactotron-react-native';

const {width, height} = Dimensions.get('window');
const arrType = [
  'com.whatsapp',
  'com.google.android.gm',
  'com.instagram.android',
  'com.facebook.katana',
  'com.twitter.android',
  'com.google.android.youtube',
];

function Contact(props) {
  const {info} = props;

  async function handlePress(url, type) {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Linking.openURL('market://details?id=' + arrType[type]);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.txtHeader}>{info.name}</Text>
      <TouchableOpacity
        style={[
          styles.btnStyle,
          {
            backgroundColor: info.data.themeColor,
          },
        ]}
        onPress={() =>
          handlePress(`whatsapp://send?text=&phone=${info.whatsapp}`, 0)
        }>
        <Text style={styles.txtbtnStyle}>Whatsapp</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <Text style={styles.txtHeader}>Technical Support</Text>
      <TouchableOpacity
        style={[
          styles.btnStyle,
          {
            backgroundColor: info.data.themeColor,
          },
        ]}
        onPress={() => handlePress(`mailto:${info.email}`, 1)}>
        <Text style={styles.txtbtnStyle}>Email</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <Text style={styles.txtHeader}>Connect With Us :</Text>
      <View style={styles.socialMedia}>
        <TouchableOpacity
          style={styles.btnSosmed}
          onPress={() => handlePress(info.instagram, 2)}>
          <Icon
            type={'font-awesome'}
            name={'instagram'}
            size={32}
            color={info.data.themeColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSosmed}
          onPress={() => handlePress(info.facebook, 3)}>
          <Icon
            type={'font-awesome'}
            name={'facebook'}
            size={32}
            color={info.data.themeColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSosmed}
          onPress={() => handlePress(info.twitter, 4)}>
          <Icon
            type={'font-awesome'}
            name={'twitter'}
            size={32}
            color={info.data.themeColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSosmed}
          onPress={() => handlePress(info.youtube, 5)}>
          <Icon
            type={'font-awesome'}
            name={'youtube'}
            size={32}
            color={info.data.themeColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  txtHeader: {fontFamily: 'ProximaNova-Extrabld', fontSize: 24},
  btnStyle: {
    width: width * 0.6,
    height: width * 0.09,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtbtnStyle: {
    fontFamily: 'ProximaNova-Extrabld',
    fontSize: 24,
    color: '#FFF',
  },
  separator: {height: width * 0.06},
  socialMedia: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnSosmed: {
    margin: 10,
  },
});

const mapStateToProps = (state) => ({
  info: state.common.info,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(CommonActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
