import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Image} from 'react-native-elements';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CommonActions from '@store/ducks/common';

import axios from 'axios';
import reactotron from 'reactotron-react-native';

function FavImage(props) {
  const {channel, title, artist, style} = props;
  const [imgURL, setImgURL] = useState(null);

  useEffect(() => {
    axios
      .get(`https://itunes.apple.com/search?term=${artist}-${title}`)
      .then((respJson) => {
        if (respJson.data.resultCount == '0') {
          var coverImg = channel.artwork;
          setImgURL(coverImg);
        } else {
          var jsonRes = respJson.data.results;
          var resultData = null;
          // cek semua data berdasarkan artistName dan trackName
          for (var i = 0; i < jsonRes.length; i++) {
            if (i == 0) {
              resultData = jsonRes[i];
            }

            if (
              jsonRes[i].artistName == artist &&
              jsonRes[i].trackName == title
            ) {
              if (jsonRes[i].collectionName !== undefined) {
                coverImg = {
                  uri: jsonRes[i].artworkUrl100.replace(/100x100/, '1024x1024'),
                };

                break;
              } else {
                coverImg = {
                  uri: jsonRes[i].artworkUrl100.replace(/100x100/, '1024x1024'),
                };
              }
              resultData = null;

              reactotron.log(coverImg);
            }
          }

          if (resultData) {
            coverImg = {
              uri: resultData.artworkUrl100.replace(/100x100/, '1024x1024'),
            };
          }

          setImgURL(coverImg);
        }
      });
  }, [title, artist, channel.artwork]);

  return <Image source={imgURL} style={style} resizeMode={'cover'} />;
}

const mapStateToProps = (state) => ({
  channel: state.common.data,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(CommonActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FavImage);
