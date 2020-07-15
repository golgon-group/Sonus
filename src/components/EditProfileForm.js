import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment/min/moment-with-locales';

import {Fonts, Theme} from '~/constants';
import {Input, Button} from '~/components';
import reactotron from 'reactotron-react-native';

import {
  configureFonts,
  DefaultTheme,
  DarkTheme,
  RadioButton,
} from 'react-native-paper';

const {width, height} = Dimensions.get('window');

const tema = {
  ...DarkTheme,
  roundness: 5,
  colors: {
    ...DarkTheme.colors,
    text: Theme.COLORS.WHITE,
    placeholder: Theme.COLORS.WHITE,
    primary: Theme.COLORS.SWITCH_ON,
    background: 'transparent',
  },
};

class EditProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.user;
    this.state = {
      ...props.user,
      isDateTimePickerVisible: false,
    };
  }

  componentDidMount() {}

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = date => {
    var umur = new Date(moment()).getFullYear() - new Date(date).getFullYear(); //Future date - current date
    this.setState(
      {
        tgl_lahir: moment(date).format('YYYY-MM-DD'),
      },
      () => {
        this.hideDateTimePicker();
      },
    );
  };

  render() {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{
          flex: 1,
          backgroundColor: Theme.COLORS.BLACK,
        }}
        contentContainerStyle={{
          marginTop: 10,
          alignItems: 'center',
        }}>
        <View style={{width: '90%', marginTop: 20}}>
          <Text
            style={{
              fontSize: 26,
              fontFamily: Fonts.FONTS.SECONDARY,
              color: Theme.COLORS.WHITE,
            }}>
            Edit Profile
          </Text>
        </View>
        <View style={{width: '90%'}}>
          <Input
            label="Username"
            onChangeText={text => this.setState({username: text})}
            value={this.state.username}
          />
        </View>
        <View style={{width: '90%'}}>
          <Input
            label="Nama Depan"
            onChangeText={text => this.setState({nama_depan: text})}
            value={this.state.nama_depan}
          />
        </View>
        <View style={{width: '90%'}}>
          <Input
            label="Nama Belakang"
            onChangeText={text => this.setState({nama_belakang: text})}
            value={this.state.nama_belakang}
          />
        </View>
        <View style={{width: '90%'}}>
          <Text style={styles.labelTitle}>Gender</Text>
          <RadioButton.Group
            onValueChange={value => this.setState({gender: value})}
            value={this.state.gender}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton
                value="Male"
                theme={tema}
                color={Theme.COLORS.WHITE}
              />
              <Text
                style={{
                  fontFamily: Fonts.FONTS.PRIMARY,
                  color: Theme.COLORS.WHITE,
                  fontSize: 14,
                }}>
                Laki-laki
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton
                value="Female"
                theme={tema}
                color={Theme.COLORS.WHITE}
              />
              <Text
                style={{
                  fontFamily: Fonts.FONTS.PRIMARY,
                  color: Theme.COLORS.WHITE,
                  fontSize: 14,
                }}>
                Perempuan
              </Text>
            </View>
          </RadioButton.Group>
        </View>
        <View style={{width: '90%'}}>
          <TouchableOpacity onPress={this.showDateTimePicker}>
            <Input
              label="Tgl Lahir"
              editable={false}
              value={
                this.state.tgl_lahir !== ''
                  ? moment(this.state.tgl_lahir).format('YYYY-MM-DD')
                  : ''
              }
            />
          </TouchableOpacity>
          <DateTimePicker
            mode={'date'}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            date={
              this.state.tgl_lahir === ''
                ? new Date(moment())
                : new Date(this.state.tgl_lahir)
            }
          />
        </View>
        <View style={{width: '90%'}}>
          <Input
            label="Bio"
            onChangeText={text => this.setState({desc: text})}
            value={this.state.desc}
            maxLength={255}
            multiline={true}
            numberOfLines={5}
          />
        </View>
        <View
          style={{width: '90%', flexDirection: 'row', alignItems: 'flex-end'}}>
          <Text
            style={{
              fontFamily: Fonts.FONTS.PRIMARY,
              color: Theme.COLORS.WHITE,
              fontSize: 14,
              width: '7%',
              marginBottom: 10,
            }}>
            +62
          </Text>
          <View style={{width: '93%'}}>
            <Input
              label="No Telepon"
              onChangeText={text => this.setState({notelp: text})}
              value={this.state.notelp}
              keyboardType={'number-pad'}
            />
          </View>
        </View>
        <Button
          title="SIMPAN"
          titleStyle={{
            fontSize: 14,
            color: '#191919',
            fontFamily: Fonts.FONTS.Label,
          }}
          buttonStyle={[
            styles.btnSimpan,
            {backgroundColor: '#FFF', marginTop: 20, marginBottom: 20},
          ]}
          onPress={() => {
            alert('Simpan Profile');
          }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  labelTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: Fonts.FONTS.Label,
  },
  btnSimpan: {
    width: width * 0.9,
    borderRadius: 20,
  },
});

export default EditProfileForm;
