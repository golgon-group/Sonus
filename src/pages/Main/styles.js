import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {Theme, Fonts} from '~/constants';

const {height, width} = Dimensions.get('window');

export const Container = styled.View`
  flex: 1;
  background-color: #191919;
`;

export const ScrollList = styled.ScrollView.attrs({
  contentInsetAdjustmentBehavior: 'automatic',
  // contentContainerStyle: {
  //   paddingLeft: 20,
  //   paddingRight: 20,
  // },
})`
  background-color: #191919;
`;

export const HeadTitles = styled.Text`
  font-size: 20px;
  ${'' /* font-weight: bold; */}
  font-family: ${Fonts.FONTS.HEADTITLES};
  color: ${Theme.COLORS.WHITE};
`;

export const ChannelId = styled.TouchableOpacity`
  ${'' /* flex: 1; */}
  ${'' /* width: ${(width - 50) / 2.5}; */}
  width: ${width}
  ${'' /* height: ${(width - 30) / 2}; */}
`;

export const ChannelTitles = styled.Text`
  font-size: 16px;
  ${'' /* font-weight: bold; */}
  text-align: center;
  font-family: ${Fonts.FONTS.HEADTITLES};
  color: ${Theme.COLORS.WHITE};
  margin-top: 5;
`;

// export const Podcast = styled.TouchableOpacity.attrs({
//   activeOpacity: 0.6
// })`
//   flex-direction: row;
//   align-items: center;
//   padding: 0 20px;
//   margin-top: 20px;
// `;

// export const Cover = styled.Image`
//   width: 80px;
//   height: 80px;
//   border-radius: 4px;
// `;

// export const Info = styled.View`
//   margin-left: 15px;
// `;

// export const Title = styled.Text`
//   color: #fff;
//   font-size: 18px;
//   font-weight: bold;
// `;

// export const Count = styled.Text`
//   color: #c4c4c4;
//   font-size: 16px;
//   margin-top: 3px;
// `;

// const styles = StyleSheet.create({
//   // headTitlesText: { marginTop: 10, fontFamily: Fonts.FONTS.DEFAULT, fontSize: 15, color: Theme.COLORS.WHITE },
//   // htBoxBackground: { width: 151, height: 151, backgroundColor: Theme.COLORS.WHITE, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
//   chImage: { width: 129, height: 77 },
//   chIcon: {
//     position: 'absolute',
//     bottom: 5,
//     left: 5,
//     backgroundColor: 'rgba(19, 19, 19, .2)',
//     // borderColor: Theme.COLORS.BORDER,
//     borderRadius: 36 / 2,
//     height: 36,
//     width: 36,
//     justifyContent: 'center',
//     alignItems: 'center'
//   }
// });
