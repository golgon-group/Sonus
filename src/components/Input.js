import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import {
  configureFonts,
  DefaultTheme,
  DarkTheme,
  TextInput,
} from 'react-native-paper';

import {Theme, Fonts} from '../constants';

const fontConfig = {
  default: {
    regular: {
      fontFamily: Fonts.FONTS.PRIMARY,
      fontWeight: 'normal',
      fontSize: 16,
    },
  },
};

const tema = {
  ...DarkTheme,
  roundness: 5,
  colors: {
    ...DarkTheme.colors,
    text: Theme.COLORS.WHITE,
    placeholder: Theme.COLORS.WHITE,
    primary: Theme.COLORS.SWITCH_ON,
    background: 'transparent',
  },
  fonts: configureFonts(fontConfig),
};

class ArInput extends Component {
  render() {
    const {success, error} = this.props;

    const inputStyles = [
      styles.input,
      success && styles.success,
      error && styles.error,
      {...this.props.style},
    ];

    return (
      <TextInput
        theme={tema}
        style={inputStyles}
        selectionColor={Theme.COLORS.WHITE}
        underlineColor={Theme.COLORS.WHITE}
        dense={true}
        {...this.props}
      />
    );
  }
}

ArInput.defaultProps = {
  success: false,
  error: false,
  // placeholder: "write something here",
};

ArInput.propTypes = {
  success: PropTypes.bool,
  error: PropTypes.bool,
  // placeholder: PropTypes.string,
};

const styles = StyleSheet.create({
  input: {
    fontSize: 14,
  },
  success: {
    borderColor: Theme.COLORS.INPUT_SUCCESS,
  },
  error: {
    borderColor: Theme.COLORS.INPUT_ERROR,
  },
});

export default ArInput;
