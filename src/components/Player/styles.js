import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {getBottomSpace, getStatusBarHeight} from 'react-native-iphone-x-helper';

import {Icon} from '~/components';

const {height, width} = Dimensions.get('window');

export const Container = styled.View`
  flex: 1;
  background: rgba(20, 20, 20, 0.9);
  height: ${height};
  width: ${width};
  ${'' /* border-color: rgba(233, 0, 0, 1);
  border-width: 1; */}

  ${'' /* align-items: center; */}
  justify-content: center;
  ${'' /* padding-bottom: ${getBottomSpace()}px; */}
`;

export const ScrollList = styled.ScrollView.attrs({
  // contentInsetAdjustmentBehavior: 'automatic',
  contentContainerStyle: {flex: 1},
  showsVerticalScrollIndicator: false,
})`
  background: rgba(19, 19, 19, 0.8);
  height: ${height};
  width: ${width};

  ${'' /* align-items: center; */}
  ${'' /* justify-content: center; */}
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

export const CoverBackground = styled.ImageBackground.attrs({
  blurRadius: 2,
})`
  position: absolute;
  height: 100%;
  width: 100%;
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
  font-size: ${width >= 500 ? '38px' : '24px'};
  font-family: 'Raleway-Bold';
  text-shadow: 1px 1px 1px #000;
  color: #f4f4f4;
`;

export const Author = styled.Text`
  font-size: ${width >= 500 ? '32px' : '18px'};
  font-family: 'Raleway-Bold';
  text-shadow: 1px 1px 1px #000;
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
  align-items: center;
`;

export const ControlButton = styled.TouchableOpacity.attrs({
  hitSlop: {top: 5, left: 5, right: 5, bottom: 5},
})``;

export const ControlIcon = styled(Icon).attrs({
  color: '#FFF',
})``;
