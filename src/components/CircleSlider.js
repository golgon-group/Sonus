import React, {Component} from 'react';
import {PanResponder, View, Dimensions} from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  Image,
  ClipPath,
  Text,
} from 'react-native-svg';
import reactotron from 'reactotron-react-native';
import {Icon} from 'react-native-elements';

export default class CircleSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      angle: this.props.value,
    };

    this.onValueChange = this.onValueChange.bind(this);
    this.runSleep = this.runSleep.bind(this);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gs) => true,
      onStartShouldSetPanResponderCapture: (e, gs) => true,
      onMoveShouldSetPanResponder: (e, gs) => true,
      onMoveShouldSetPanResponderCapture: (e, gs) => true,
      onPanResponderMove: (e, gs) => {
        let xOrigin =
          this.props.xCenter - (this.props.dialRadius + this.props.btnRadius);
        let yOrigin =
          this.props.yCenter - (this.props.dialRadius + this.props.btnRadius);
        let a = this.cartesianToPolar(gs.moveX - xOrigin, gs.moveY - yOrigin);

        // reactotron.log('Move : ' + a);

        if (a <= this.props.min) {
          this.setState({angle: this.props.min});
          this.onValueChange(this.props.min);
        } else if (a >= this.props.max) {
          this.setState({angle: this.props.max});
          this.onValueChange(this.props.max);
        } else {
          this.setState({angle: a});
          this.onValueChange(a);
        }
      },
      onPanResponderGrant: (e, gs) => {
        // The gesture has started. Show visual feedback so the user know
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderRelease: (e, gs) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        if (this.state.angle > 0) {
          this.runSleep(this.state.angle);
          reactotron.log(
            'Time is : ' + Math.ceil(this.state.angle * 60) + ' seconds',
          );
        }
      },
      onPanResponderTerminate: (e, gs) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.angle) {
      // this.onValueChange(nextProps.value);
      return {angle: nextProps.value};
    } else {
      return null;
    }
  }

  runSleep(time) {
    this.props.runSleep(time);
  }

  onValueChange(value) {
    this.props.onValueChange(value);
  }

  polarToCartesian(angle) {
    let r = this.props.dialRadius;
    let hC = this.props.dialRadius + this.props.btnRadius;
    let a = ((angle - 15) * Math.PI) / 30.0;

    let x = hC + r * Math.cos(a);
    let y = hC + r * Math.sin(a);

    return {x, y};
  }

  cartesianToPolar(x, y) {
    let hC = this.props.dialRadius + this.props.btnRadius;

    if (x === 0) {
      return y > hC ? 1 : 30;
    } else if (y === 1) {
      return x > hC ? 15 : 45;
    } else {
      return (
        Math.round((Math.atan((y - hC) / (x - hC)) * 30) / Math.PI) +
        (x > hC ? 15 : 45)
      );
    }
  }

  render() {
    let width = (this.props.dialRadius + this.props.btnRadius) * 2;
    let bR = this.props.btnRadius;
    let dR = this.props.dialRadius;
    let startCoord = this.polarToCartesian(0);
    let endCoord = this.polarToCartesian(this.state.angle);

    return (
      <Svg width={width} height={width}>
        <Circle
          r={dR}
          cx={width / 2}
          cy={width / 2}
          stroke={this.props.strokeColor}
          strokeWidth={this.props.strokeWidth}
          fill={this.props.fillColor}
        />

        <Path
          stroke={this.props.meterColor}
          strokeWidth={this.props.dialWidth}
          fill="none"
          d={`M${startCoord.x} ${startCoord.y} A ${dR} ${dR} 0 ${
            this.state.angle > 30 ? 1 : 0
          } 1 ${endCoord.x} ${endCoord.y}`}
        />

        <G
          x={endCoord.x - bR}
          y={endCoord.y - bR}
          {...(!this.props.disabled && this._panResponder.panHandlers)}>
          <Circle
            r={bR}
            cx={bR}
            cy={bR}
            fill={this.props.meterColor}
            stroke={'rgba(234, 236, 238, 0.3)'}
            strokeWidth={1}
          />
          <Image
            x={bR - 15}
            y={bR - 15}
            width={this.props.iconSize}
            height={this.props.iconSize}
            href={require('../assets/images/sleep_icon.png')}
            clipPath="url(#clip)"
          />
        </G>
      </Svg>
    );
  }
}

CircleSlider.defaultProps = {
  disabled: false,
  btnRadius: 15,
  dialRadius: 130,
  dialWidth: 5,
  meterColor: '#0cd',
  textColor: '#fff',
  fillColor: 'none',
  strokeColor: '#fff',
  strokeWidth: 0.5,
  textSize: 10,
  iconSize: 32,
  value: 0,
  min: 0,
  max: 359,
  xCenter: Dimensions.get('window').width / 2,
  yCenter: Dimensions.get('window').height / 2,
  // onPress: () => console.log('Please attach a method to this component'),
};
