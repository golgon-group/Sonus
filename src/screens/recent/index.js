import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import reactotron from 'reactotron-react-native';
import {Image, Icon} from 'react-native-elements';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CommonActions from '@store/ducks/common';

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
    id: 3,
    title: 'PodNode',
    cover: 'https://s3-sa-east-1.amazonaws.com/gonative/cover3.png',
    likes: '978612',
  },
  {
    id: 4,
    title: 'JSCast',
    cover: 'https://s3-sa-east-1.amazonaws.com/gonative/cover4.png',
    likes: '878612',
  },
  {
    id: 5,
    title: 'Rádio ReactJS',
    cover: 'https://s3-sa-east-1.amazonaws.com/gonative/cover5.png',
    likes: '778612',
  },
];

function Recent(props) {
  const {common, navigation} = props;
  const [data, setData] = useState(null);

  const channel = common.data;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setData(podcast);
      reactotron.log(podcast);
    });

    setData(podcast);
    reactotron.log('Tarik Data');

    return unsubscribe;
  }, [navigation, data, channel]);

  return (
    <View
      style={[
        styles.container,
        {
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}>
      <Text style={{fontFamily: 'ProximaNova-Regular'}}>Coming Soon !</Text>
      {/* <FlatList
        style={styles.flatStyle}
        contentContainerStyle={styles.contentStyle}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({item, index}) => (
          <View style={styles.itemContainer}>
            <View style={styles.imgContainer}>
              <Image
                style={styles.imgStyle}
                source={{uri: item.cover}}
                resizeMode={'cover'}
              />
            </View>
            <View style={styles.txtContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.artist}>Artist - {channel.id}</Text>
            </View>
            <View style={styles.likeContainer}>
              <TouchableOpacity
                onPress={() => alert('You like this Song ' + item.title)}>
                <Icon type={'ionicon'} name={'ios-heart-outline'} size={24} />
              </TouchableOpacity>
              <Text style={styles.likes}>{item.likes}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{height: 20}} />}
        keyExtractor={(item) => '' + item.id}
      /> */}
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
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(CommonActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Recent);
