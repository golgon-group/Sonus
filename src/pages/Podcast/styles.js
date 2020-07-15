import styled from 'styled-components/native';

// @ts-ignore
import {Icon} from '~/components';

export const Container = styled.View`
  flex: 1;
  background-color: #191919;
`;

// @ts-ignore
export const EpisodeList = styled.FlatList.attrs({
  contentContainerStyle: {paddingBottom: 30},
})``;

export const PodcastDetails = styled.View`
  ${'' /*border: 2px solid white;

  height: 100%;
  width: 100%;
 */}
  align-items: center;

  padding-top: 70px;
  padding-bottom: 20px;
`;

export const Background = styled.ImageBackground`
  position: absolute;
  width: 100%;
  opacity: 0.2;
`;

export const BackButton = styled.TouchableOpacity.attrs({
  hitSlop: {top: 5, left: 5, right: 5, bottom: 5},
})`
  margin-top: 20px;
  position: absolute;
  left: 10px;
`;

export const RightButton = styled.TouchableOpacity.attrs({
  hitSlop: {top: 5, left: 5, right: 5, bottom: 5},
})`
  margin-top: 20px;
  position: absolute;
  right: -20px;
`;

export const PodcastTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin-top: 20px;
`;

export const PodcastSubTitle = styled.Text`
  font-size: 10px;
  color: #fff;
  margin-top: 10px;
`;

export const ButtonContainer = styled.View.attrs({})`
  flex: 1;
  flex-direction: row;
  ${'' /* border: 2px solid white; */}
  width: 100%;

  align-self: stretch;
  align-items: center;
  justify-content: center;

  padding-left: 20px;
  padding-right: 20px;
`;

export const PlayButton = styled.TouchableOpacity.attrs({
  // activeOpacity: 0.6,
})`
  height: 50px;
  width: 40%;
  ${'' /* background: #1db954;
  border: 2px solid white; */}
  margin: 30px 40px 0;
  border-radius: 25px;

  align-self: stretch;
  align-items: center;
  justify-content: center;
`;

export const PlayButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 1.5px;
`;

export const FollowButton = styled.TouchableOpacity.attrs({
  // activeOpacity: 0.6,
})`
  height: 50px;
  ${'' /* width: 40%;
  background: #1db954; */}
  border: 2px solid white;
  margin: 30px 40px 0;
  border-radius: 25px;
  flex-direction: row;

  align-self: stretch;
  align-items: center;
  justify-content: center;
`;

export const FollowButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 1.5px;
`;

export const Cover = styled.Image`
  width: 180px;
  height: 180px;
  border-radius: 8px;
`;

export const Episode = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 0 20px;
`;

export const Album = styled.Image`
  margin-top: 20px;
  margin-left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 4px;
`;

export const Title = styled.Text`
  font-size: 16px;
  color: ${({
    // @ts-ignore
    active,
  }) => (active ? '#1db954' : '#FFF')};
`;

export const Author = styled.Text`
  color: #c4c4c4;
  font-size: 14px;
  margin-top: 3px;
`;

export const ControlIcon = styled(Icon).attrs({
  color: '#FFF',
  size: 24,
  marginRight: 30,
})``;
