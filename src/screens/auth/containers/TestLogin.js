import React, {Component} from 'react';
import {Platform, StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {isLogin: false};
  }
  async handleResponse() {
    try {
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });
      if (appleAuthRequestResponse.realUserStatus) {
        this.setState({isLogin: true});
      }
    } catch (error) {
      if (error.code === AppleAuthError.CANCELED) {
      }
      if (error.code === AppleAuthError.FAILED) {
        alert('Touch ID wrong');
      }
      if (error.code === AppleAuthError.INVALID_RESPONSE) {
        alert('Touch ID wrong');
      }
      if (error.code === AppleAuthError.NOT_HANDLED) {
      }
      if (error.code === AppleAuthError.UNKNOWN) {
        alert('Touch ID wrong');
      }
    }
  }
  onLogout() {
    this.setState({isLogin: false});
  }

  render() {
    return (
      <View style={styles.container}>
        {' '}
        {!this.state.isLogin ? (
          <AppleButton
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            onPress={() => this.handleResponse()}
            style={styles.appleButton}
          />
        ) : (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => this.onLogout()}>
            {' '}
            <Text style={{color: 'white'}}>LOGOUT</Text>{' '}
          </TouchableOpacity>
        )}{' '}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  appleButton: {width: 300, height: 50, margin: 10},
  logoutButton: {
    width: 300,
    height: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});
