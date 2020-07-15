import React from 'react';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';

import {Icon} from 'react-native-elements';

// import argonConfig from '~/assets/fonts/argon.json';

// const ArgonExtra = require('~/assets/fonts/argon.ttf');
// const IconArgonExtra = createIconSetFromIcoMoon(argonConfig);

class IconExtra extends React.Component {
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    // await Font.loadAsync({ ArgonExtra: ArgonExtra });
    this.setState({fontLoaded: true});
  }

  render() {
    const {name, family, ...rest} = this.props;

    if (name && family && this.state.fontLoaded) {
      // if (family === 'ArgonExtra') {
      //   return <IconArgonExtra name={name} family={family} {...rest} />;
      // }
      return <Icon name={name} type={family} {...rest} />;
    }

    return null;
  }
}

export default IconExtra;
