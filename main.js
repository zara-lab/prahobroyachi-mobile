import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated
} from 'react-native';

//import { Animated, View, Text, StyleSheet } from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';
import createLogger from 'redux-logger';

import reducers from './app/reducers';
import epic from './app/epic';
import Main from './app/containers/Main';

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(
    createEpicMiddleware(epic),
    createLogger()
  )
);
store.dispatch({ type: 'APP_INIT' });

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#222',
  },
  tab: {
    padding: 0,
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  indicator: {
    flex: 1,
    backgroundColor: '#fdaf17',
    margin: 4,
    borderRadius: 2,
  },
  badge: {
    marginTop: 4,
    marginRight: 32,
    backgroundColor: '#35bda5',
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class prahobroyachi extends Component {

  static title = 'Bottom bar with indicator';
  static appbarElevation = 4;

  static propTypes = {
    style: View.propTypes.style,
  };

  state = {
    index: 1,
    routes: [
      { key: '1', title: 'Settings', icon: 'wrench' },
      { key: '2', title: 'Dust', icon: 'pie-chart' },
      { key: '3', title: 'Log', icon: 'list-alt' },
    ],
  };

  _handleChangeTab = (index) => {
    this.setState({
      index,
    });
  };

  _renderIndicator = (props) => {
    const { width, position } = props;

    const translateX = Animated.multiply(position, width);

    return (
      <Animated.View
        style={[ styles.container, { width, transform: [ { translateX } ] } ]}
      >
        <View style={styles.indicator} />
      </Animated.View>
    );
  };

  _renderIcon = ({ route }: any) => {
    return (
      <Icon
        name={route.icon}
        size={24}
        style={styles.icon}
      />
    );
    return null
  };

  _renderBadge = ({ route }) => {
    if (route.key === '3') {
      return (
        <View style={styles.badge}>
          <Text style={styles.count}>42</Text>
        </View>
      );
    }
    return null;
  };

  _renderFooter = (props) => {
    return (
      <TabBar
        {...props}
        renderIcon={this._renderIcon}
        renderBadge={this._renderBadge}
        renderIndicator={this._renderIndicator}
        style={styles.tabbar}
        tabStyle={styles.tab}
      />
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
    case '1':
      return <View style={[ styles.page, { backgroundColor: '#ffd800' } ]} />;
    case '2':
      return <View style={[ styles.page, { backgroundColor: '#5f4ba0' } ]} >
                <Main />
             </View>;
    case '3':
      return <View style={[ styles.page, { backgroundColor: '#35bda5' } ]} />;
    default:
      return null;
    }
  };

  render() {
  //   return <Provider store={store}>
  //   <Main />
  // </Provider>;
    return (
      <Provider store={store}>
        <TabViewAnimated
          style={[ styles.container, this.props.style ]}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderFooter={this._renderFooter}
          onRequestChangeTab={this._handleChangeTab}
        />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('prahobroyachi', () => prahobroyachi);
