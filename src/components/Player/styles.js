import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {getBottomSpace, getStatusBarHeight} from 'react-native-iphone-x-helper';

import {Icon} from '~/components';

const {height, width} = Dimensions.get('window');

export const Container = styled.View`
  background: rgba(19, 19, 19, 0.8);
  height: 100%;
  width: 100%;

  ${'' /* align-items: center; */}
  justify-content: center;
  padding-bottom: ${getBottomSpace()}px;
`;

export const BackButton = styled.TouchableOpacity.attrs({
  hitSlop: {top: 5, left: 5, right: 5, bottom: 5},
})`
  position: absolute;
  top: 5px;
  left: 0px;
`;

export const RightButton = styled.TouchableOpacity.attrs({
  hitSlop: {top: 5, left: 5, right: 5, bottom: 5},
})`
  position: absolute;
  top: 5px;
  right: 0px;
`;

export const CoverBackground = styled.Image.attrs({
  blurRadius: 2,
})`
  position: absolute;
  height: ${height};
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  opacity: 0.8;
`;

export const Block = styled.View`
  align-items: center;
  margin-top: 20%;
`;

export const Cover = styled.Image`
  width: ${width};
  height: ${width};
  ${'' /* border-radius: 10px; */}
`;

export const EpisodeInfo = styled.View`
  ${'' /* align-items: center; */}
  margin-left: 20px;
  margin-top: 20px;
`;

export const Title = styled.Text.attrs({
  numberOfLines: 2,
  ellipsizeMode: 'tail',
})`
  font-size: 24px;
  text-shadow: 2px 2px 2px #000;
  color: #fcfcfc;
`;

export const Author = styled.Text`
  font-size: 18px;
  text-shadow: 2px 2px 2px #000;
  color: #f4f4f4;
  margin-top: 3px;
`;

export const Controls = styled.View`
  flex-direction: ${({
    // @ts-ignore
    stream,
  }) => (stream ? 'column' : 'row')};
  width: 100%;
  margin-top: 10%;
  padding-left: 30%;
  padding-right: 30%;
  justify-content: space-between;
`;

export const ControlButton = styled.TouchableOpacity.attrs({
  hitSlop: {top: 5, left: 5, right: 5, bottom: 5},

  // shadowOpacity: 2,
  shadowColor: '#ce5937',
  textShadowRadius: 4,
  textShadowOffset: {width: 2, height: 2},
  elevation: 5,
})`
  height: 50px;
`;

export const ControlIcon = styled(Icon).attrs({
  color: '#FFF',
  shadowColor: '#ce5937',
  // shadowOpacity: 0.5,
  shadowRadius: 5,
  shadowOffset: {
    width: 0, // These can't both be 0
    height: 10, // i.e. the shadow has to be offset in some way
  },
  elevation: 5,
})``;
