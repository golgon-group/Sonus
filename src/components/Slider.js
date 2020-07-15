import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  View,
  Image,
  Text,
  ToastAndroid,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import FastImage from 'react-native-fast-image';
import Moment from 'moment';

import {Theme, Fonts} from '~/constants';
import {Icon} from '~/components';
import reactotron from 'reactotron-react-native';

const loading = {
  uri:
    'https://loading.io/spinners/rolling/lg.curve-bars-loading-indicator.gif',
};
// @ts-ignore
const dataSource = require('~/server.json');

var {height, width} = Dimensions.get('window');

// Indonesian locale
var idLocale = require('moment/locale/id');
Moment.locale('id', idLocale);

const Slide = props => {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        height: Math.ceil((width + 30) / 2.5),
        width: Math.ceil((width - 70) / 2.5),
        marginRight: 20,
      }}
      onPress={() => Actions.podcast({podcast: props.podcasts})}>
      <View style={styles.htBoxBackground}>
        <FastImage
          style={{
            width: Math.ceil((width - 70) / 2.5),
            height: Math.ceil((width - 60) / 2.5),
            borderRadius: 5,
          }}
          source={{
            uri: props.uri,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.chIcon}>
          <Icon
            name={'play'}
            family={'font-awesome'}
            size={18}
            color={Theme.COLORS.WHITE}
          />
        </View>
      </View>
      <Text
        style={{
          fontFamily: Fonts.FONTS.Label,
          color: Theme.COLORS.WHITE,
          fontSize: Math.ceil(width * 0.0235),
        }}>
        {props.title}
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon
          name={'heart'}
          family={'foundation'}
          size={Math.ceil(width * 0.0235) - 1}
          color={Theme.COLORS.MUTED}
        />
        <Text
          style={{
            marginLeft: 5,
            fontFamily: Fonts.FONTS.Label,
            color: Theme.COLORS.MUTED,
            fontSize: Math.ceil(width * 0.0235) - 1,
          }}>
          {props.likes}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const heightImageSlide = width * (475 / 960);

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadQueue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      dataSource: dataSource.podcasts,
      _data: null,
      _dataAfter: 1,
      isVisible: true,
    };
    this.loadHandle = this.loadHandle.bind(this);
    this.fetchData = this._fetchData.bind(this);
  }

  currencyFormat(text) {
    var reText = text.toString();
    return reText.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }

  loadHandle(i) {
    let loadQueue = this.state.loadQueue;
    loadQueue[i] = 1;
    this.setState({
      loadQueue,
    });
  }

  componentDidMount() {
    this.fetchData();
    // reactotron.log(JSON.stringify(dataSource.podcasts));
  }

  _fetchData() {
    this.setState({
      isVisible: false,
    });
    // const params = `&page=${this.state._dataAfter}`;
    // const kategori = `${this.props.kategori}`;

    // const url = kategori == 1 ? `https://www.jurnalasia.com/wp-json/wordpress-popular-posts/v1/popular-posts?limit=5&freshness=1` : `https://www.jurnalasia.com/wp-json/wp/v2/posts?categories=${kategori}&page=1&per_page=10`;

    // fetch(url)
    // .then(response => response.json())
    // .then((responseJson) => {
    //   this.setState({
    //     isVisible: false,
    //     dataSource: responseJson
    //   }); // Set the new state
    // })
    // .catch(error => {
    //   console.error(error);
    // });
  }

  findArrayElementByTitle(inputArray, categories) {
    let obj = inputArray.find(data => data.id == categories);
    return obj.value;
  }

  render() {
    if (this.state.isVisible) {
      return (
        <View style={styles.pageContainer}>
          <Text style={{color: '#FFF'}}>Loading</Text>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Text
              style={{
                width: '80%',
                fontFamily: Fonts.FONTS.HEADTITLES,
                color: Theme.COLORS.WHITE,
                fontSize: 20,
              }}>
              {this.props.title}
            </Text>
            <TouchableOpacity style={{width: '20%', alignItems: 'flex-end'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: Theme.COLORS.MUTED}}>View All</Text>
                <Icon
                  name="right"
                  family="antdesign"
                  size={12}
                  color={Theme.COLORS.MUTED}
                />
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            style={{flex: 1, marginTop: 20}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={this.state.dataSource}
            renderItem={({item, index}) => {
              return (
                <Slide
                  uri={item.cover}
                  id={item.id}
                  title={item.title}
                  likes={this.currencyFormat(item.likes)}
                  key={index}
                  podcasts={item}
                />
              );
            }}
            initialNumToRender={2}
            maxToRenderPerBatch={5}
            keyExtractor={(item, index) => '' + item.id}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  chIcon: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(19, 19, 19, .2)',
    // borderColor: Theme.COLORS.BORDER,
    borderRadius: 36 / 2,
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  htBoxBackground: {width: (width - 70) / 2.5, height: (width - 60) / 2.5},
});

// export default connect()(Slider);
export {Slider};
