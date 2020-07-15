import React, {Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PlayerActions from '~/store/ducks/player';

import {
  ControlIcon,
  Container,
  EpisodeList,
  PodcastDetails,
  PodcastTitle,
  PodcastSubTitle,
  ButtonContainer,
  Cover,
  PlayButton,
  PlayButtonText,
  FollowButton,
  FollowButtonText,
  Episode,
  Author,
  Title,
  BackButton,
  RightButton,
  Album,
} from './styles';
import reactotron from 'reactotron-react-native';
import {Actions} from 'react-native-router-flux';

import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';

class Podcast extends Component {
  componentDidMount() {}

  handlePlay = podcastId => {
    const {setPodcastRequest, podcast} = this.props;

    // const idPodcast = podcast.tracks.find(episode => episode.id === '0');
    // reactotron.log('ID Podcast : ' + podcastId);

    setPodcastRequest(podcast, podcastId);
  };

  handleFollow = podcastId => {
    const {setFollowRequest} = this.props;

    setFollowRequest(podcastId);
  };

  render() {
    const {
      podcast,
      currentEpisode,
      isFollowing,
      isplaying,
      is_stream,
    } = this.props;

    return (
      <Container>
        <EpisodeList
          ListHeaderComponent={() => (
            <PodcastDetails>
              <BackButton onPress={() => Actions.pop()}>
                <ControlIcon name="arrow-back" family="material" />
              </BackButton>
              <RightButton onPress={() => this.ActionSheet.show()}>
                <ControlIcon name="more-vert" family="material" />
              </RightButton>

              <Cover source={{uri: podcast.cover}} />
              <PodcastTitle>{podcast.title}</PodcastTitle>
              <PodcastSubTitle>BY {podcast.title}</PodcastSubTitle>
              <FollowButton onPress={() => this.handleFollow(podcast)}>
                <ControlIcon
                  name={isFollowing ? 'heart' : 'heart-alt'}
                  family="fontisto"
                  size={32}
                />
                <FollowButtonText>
                  {isFollowing ? 'Following' : 'Follow'}
                </FollowButtonText>
              </FollowButton>
              {/* <ButtonContainer>
                <PlayButton onPress={() => this.handlePlay()}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#35EDFB', '#2D9BEF', '#9B2DEF']}
                    style={{
                      flex: 1,
                      borderRadius: 25,
                      alignSelf: 'stretch',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ControlIcon
                      name={isplaying && !is_stream ? 'pause' : 'play'}
                      family="fontisto"
                      size={32}
                    />
                    <PlayButtonText>
                      {isplaying && !is_stream ? 'Pause' : 'Play'}
                    </PlayButtonText>
                  </LinearGradient>
                </PlayButton>
              </ButtonContainer> */}
            </PodcastDetails>
          )}
          data={podcast.tracks}
          keyExtractor={episode => String(episode.id)}
          renderItem={({item: episode}) => (
            /* eslint-disable-next-line react-native/no-inline-styles */
            <Container style={{flexDirection: 'row', alignItems: 'center'}}>
              <Album source={{uri: episode.artwork}} />
              <Episode onPress={() => this.handlePlay(episode.id)}>
                <Title
                  // @ts-ignore
                  active={currentEpisode && currentEpisode.id === episode.id}>
                  {episode.title}
                </Title>
                <Author>{episode.artist}</Author>
              </Episode>
            </Container>
          )}
        />

        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={'Which one do you like ?'}
          options={[
            'Cancel',
            'Add to Playlist',
            'Add to Queue',
            'View Album',
            'View Artist',
            'Share',
          ]}
          cancelButtonIndex={0}
          destructiveButtonIndex={0}
          onPress={index => {
            /* do something */
          }}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  currentEpisode: state.player.podcast
    ? state.player.podcast.tracks.find(
        episode => episode.id === state.player.current,
      )
    : null,
  isFollowing: state.player.isFollowing,
  isplaying: state.player.playing,
  is_stream: state.player.is_stream,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(PlayerActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Podcast);
