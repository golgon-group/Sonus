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
import axios from 'axios';

const {width, height} = Dimensions.get('window');

const emptyData = [
  {
    dj: 'City Mandarin 95.9 FM',
    dj2: '',
    foto: require('@images/city_fm_mandarin.jpg'),
    id: 1,
    nama_program: '24 Hours Mandarin Songs',
  },
];

function Shows(props) {
  const {common, navigation} = props;
  const [data, setData] = useState(null);

  const channel = common.data;

  useEffect(() => {
    let valData = null;
    const unsubscribe = navigation.addListener('focus', () => {
      axios
        .get(`${channel.apiUrl}/program`)
        .then((res) => {
          const result = res.data;

          valData = result.data;
        })
        .catch((error) => {
          reactotron.log(error);
          valData = emptyData;
        })
        .then(() => {
          setData(valData);
        });
    });

    axios
      .get(`${channel.apiUrl}/program`)
      .then((res) => {
        const result = res.data;

        valData = result.data;
      })
      .catch((error) => {
        reactotron.log(error);
        valData = emptyData;
      })
      .then(() => {
        setData(valData);
      });

    return unsubscribe;
  }, [navigation, channel, setData]);

  return (
    <View style={styles.container}>
      {data != null ? (
        <FlatList
          style={styles.flatStyle}
          contentContainerStyle={styles.contentStyle}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({item, index}) => {
            // reactotron.log(
            //   'https://' +
            //     channel.urlWeb +
            //     '/assets/program_image/' +
            //     item.foto,
            // );
            return (
              <View style={styles.itemContainer}>
                <View style={styles.imgContainer}>
                  {channel.id == 'citymandarin' ? (
                    <Image
                      style={styles.imgStyle}
                      source={item.foto}
                      PlaceholderContent={
                        <ActivityIndicator
                          color={channel.themeColor}
                          size={'small'}
                        />
                      }
                      resizeMode={'cover'}
                    />
                  ) : (
                    <Image
                      style={styles.imgStyle}
                      source={{
                        uri:
                          'https://' +
                          channel.urlWeb +
                          '/assets/program_image/' +
                          item.foto,
                      }}
                      PlaceholderContent={
                        <ActivityIndicator
                          color={channel.themeColor}
                          size={'small'}
                        />
                      }
                      resizeMode={'cover'}
                    />
                  )}
                </View>
                <View style={styles.txtContainer}>
                  <Text style={styles.title}>{item.nama_program}</Text>
                  <Text style={styles.artist}>
                    {item.dj2 === '' ? item.dj : item.dj + ' - ' + item.dj2}
                  </Text>
                </View>
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={{height: 20}} />}
          keyExtractor={(item, index) => '' + index}
          initialNumToRender={5}
        />
      ) : (
        <ActivityIndicator size={'large'} color={common.themeColor} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, height: height},
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
    width: '65%',
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

export default connect(mapStateToProps, mapDispatchToProps)(Shows);
