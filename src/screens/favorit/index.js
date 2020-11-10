import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import reactotron from 'reactotron-react-native';
import {Image, Icon} from 'react-native-elements';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CommonActions from '@store/ducks/common';
import FavoritActions from '@store/ducks/favorit';
import FavImage from './favImage';

const {width, height} = Dimensions.get('window');

const podcast = [
  {
    id: 1,
    title: 'RocketCast',
    cover: 'https://s3-sa-east-1.amazonaws.com/gonative/cover1.png',
    likes: '1278612',
  },
  {
    id: 2,
    title: 'React Native Cast',
    cover: 'https://s3-sa-east-1.amazonaws.com/gonative/cover2.png',
    likes: '1078612',
  },
  {
    id: 5,
    title: 'Rádio ReactJS',
    cover: 'https://s3-sa-east-1.amazonaws.com/gonative/cover5.png',
    likes: '778612',
  },
];

function Favorit(props) {
  const {common, navigation, listFavorit, setRankRequest} = props;
  // const [data, setData] = useState(null);

  const channel = common.data;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setRankRequest(channel);
      // setData(podcast);
      // reactotron.log(podcast);
    });

    setRankRequest(channel);

    return unsubscribe;
  }, [navigation, setRankRequest, channel]);

  reactotron.log('Daftar Sekarang', listFavorit);

  return (
    <View
      style={[
        styles.container,
        {
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}>
      {listFavorit != null ? (
        listFavorit.length === 0 ? (
          <Text style={{fontFamily: 'ProximaNova-Regular'}}>
            Tidak ada daftar Favorit untuk sekarang
          </Text>
        ) : (
          <FlatList
            style={styles.flatStyle}
            contentContainerStyle={styles.contentStyle}
            showsVerticalScrollIndicator={false}
            data={listFavorit.slice(0, 20)}
            renderItem={({item, index}) => (
              <View style={styles.itemContainer}>
                <View style={styles.imgContainer}>
                  <FavImage
                    style={styles.imgStyle}
                    title={item.judul}
                    artist={item.artis}
                  />
                </View>
                <View style={styles.txtContainer}>
                  <Text style={styles.title}>{item.judul}</Text>
                  <Text style={styles.artist}>{item.artis}</Text>
                </View>
                <View style={styles.likeContainer}>
                  <Icon
                    type={'ionicon'}
                    name={'ios-heart'}
                    size={24}
                    color={channel.themeColor}
                  />
                  <Text style={styles.likes}>{item.count}</Text>
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            keyExtractor={(item, index) => '' + index}
          />
        )
      ) : (
        <ActivityIndicator size={'large'} color={channel.themeColor} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, height: height, backgroundColor: '#FFF'},
  flatStyle: {width: width, backgroundColor: '#FFF'},
  contentStyle: {
    paddingTop: 20,
    paddingLeft: width * 0.025,
    paddingRight: width * 0.025,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    height: height * 0.125,
    width: width * 0.95,
  },
  imgContainer: {
    height: '100%',
    width: '35%',
  },
  imgStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  txtContainer: {
    height: '100%',
    width: '50%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {
    fontFamily: 'ProximaNova-Extrabld',
    fontSize: width >= 500 ? 24 : width <= 400 ? 14 : 20,
  },
  artist: {
    fontFamily: 'ProximaNova-Regular',
    fontSize: width >= 500 ? 22 : width <= 400 ? 12 : 16,
  },
  likeContainer: {height: '100%', width: '15%', alignItems: 'center'},
  likes: {fontFamily: 'ProximaNova-Regular', fontSize: 12},
});

const mapStateToProps = (state) => ({
  common: state.common,
  listFavorit: state.favorit.fav_data,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    Object.assign({}, CommonActions, FavoritActions),
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Favorit);
