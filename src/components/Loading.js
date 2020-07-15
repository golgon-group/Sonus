import React, {Component} from 'react';
import {Dimensions, View, StyleSheet, ActivityIndicator} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PlayerActions from '~/store/ducks/player';

const {height, width} = Dimensions.get('window');

function Loading(props) {
  const {player, routes} = props;

  return (
    player.is_loading &&
    routes.scene !== 'player' && (
      <View style={styles.container}>
        <ActivityIndicator
          style={styles.loading}
          size={'large'}
          color={'#F4F6F7'}
        />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 999,
  },
  loading: {
    marginTop: 10,
  },
});

const mapStateToProps = state => ({
  player: state.player,
  routes: state.routes,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(PlayerActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Loading);
