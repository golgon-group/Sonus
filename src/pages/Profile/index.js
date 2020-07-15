import React from 'react';
import {ScrollView, StatusBar} from 'react-native';
import ProfileHeader from '~/components/ProfileHeader';
import EditProfileForm from '~/components/EditProfileForm';

const userProf = {
  username: 'juniardi93',
  nama_depan: 'Juniardi',
  nama_belakang: 'Hartanto',
  tgl_lahir: '',
  gender: '',
  desc:
    'Experienced Auditor with a demonstrated history of working in the furniture industry. Skilled in React Native, Android Studio, Desktop and Web Development. Professional business system and management.',
  profileImage:
    'https://scontent.fcgk4-1.fna.fbcdn.net/v/t1.0-9/17883811_1626879283992878_5867437045715382258_n.jpg?_nc_cat=111&_nc_ohc=mu90BMvNW30AQk6TXmO8jbQS_kP-kQwB6z_C1m1ITSGbpzJfpNVw9ZCjA&_nc_ht=scontent.fcgk4-1.fna&oh=0762d44a43ea10b89f64a91201fd2e0e&oe=5E3FF6BA',
  coverImage:
    'https://scontent.fcgk4-2.fna.fbcdn.net/v/t1.0-9/10599441_905912456089568_8761786481400154908_n.jpg?_nc_cat=109&_nc_ohc=5uYHLaSOpF8AQmqLjNlRCjHFycq2-GXMvvDcLiRLrPBKuvDw-VNBffd3Q&_nc_ht=scontent.fcgk4-2.fna&oh=a29c70ef1041be40d2120ebcc189d35e&oe=5E40A065',
  notelp: '',
};

export default class ProfileScreen extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <ScrollView style={{flex: 1, backgroundColor: '#000'}}>
        <ProfileHeader userData={userProf} />
        <EditProfileForm user={userProf} />
      </ScrollView>
    );
  }
}
