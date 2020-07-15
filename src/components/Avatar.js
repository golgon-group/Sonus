import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {LinearGradient as Gradient} from 'react-native-linear-gradient';

const Avatar = ({source, size}) => {
  return (
    <Image
      style={{
        height: size,
        width: size,
        borderRadius: size / 2,
        position: 'absolute',
        right: 10,
      }}
      source={{uri: source}}
    />
  );
};

export default Avatar;
