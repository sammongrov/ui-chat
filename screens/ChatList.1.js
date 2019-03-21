import React, { Component } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  // Image,
} from 'react-native';
import { ListItem, SearchBar, Badge, Avatar, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, Screen, NavBar } from '@ui/components';
// import brandLogo from '../../../images/logo.png';

const styles = StyleSheet.create({
  leftElementContainer: {
    flexDirection: 'row',
    width: 35,
  },
  leftElementAvatarView: {
    flexDirection: 'column',
    padding: 0,
    margin: 0,
  },
  leftElementStatusView: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  rightContainer: {
    // flex: 1,
    flexDirection: 'column',
  },
  rightContainerTopView: {
    // flex: 1,
    flexDirection: 'row',
  },
  rightContainerBottomView: {
    // flex: 1,
    flexDirection: 'row',
    // borderBottomWidth: 1,
    // borderBottomColor: '#CED0CE',
    // paddingBottom: 10,
  },
  rightContainerTopPane1: {
    flexDirection: 'column',
    flex: 1,
  },
  rightContainerTopPane2: {
    flexDirection: 'column',
    flex: 1,
    width: 30,
    // borderWidth: 1,
  },
  rightContainerTopPaneText: {
    color: 'black',
    fontSize: 16,
  },
  rightContainerBottomPane: {
    flexDirection: 'column',
    flex: 1,
  },
  rightContainerBottomPaneText: {
    alignSelf: 'flex-start',
    color: '#808080',
    fontSize: 10,
  },
  rightContainerBottomPane2Text: {
    alignSelf: 'flex-end',
    color: '#808080',
    fontSize: 10,
    // marginRight: 25,
  },
  rightContainerBottomPane2LongText: {
    alignSelf: 'flex-end',
    color: '#808080',
    fontSize: 10,
  },
  badgeView: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginRight: 0,
    height: 12,
    // borderWidth: 1,
  },
  badgeText: {
    height: 12,
    fontSize: 10,
    padding: 0,
    margin: 0,
    color: '#fff',
  },
  titleStyle: {
    color: '#2E88FF',
    fontSize: 18,
  },
});

class ChatList extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.logoPress = this.props.logoPress;
    this.iconPress = this.props.iconPress;
    this.state = {
      loading: false,
      data: [],
      // data: [{"gender":"male","name":{"title":"mr","first":"janique","last":"costa"},"location":{"street":"8364 rua belo horizonte ","city":"araraquara","state":"rondônia","postcode":12989,"coordinates":{"latitude":"-74.5614","longitude":"-150.0978"},"timezone":{"offset":"+1:00","description":"Brussels, Copenhagen, Madrid, Paris"}},"email":"janique.costa@example.com","login":{"uuid":"827d20c0-fa56-40aa-a2de-7df6d682d269","username":"smalltiger544","password":"brownie","salt":"7QvzaON4","md5":"12b90398592831552763936af62cf6e8","sha1":"3e7edd839bf49ad03b1df58a9f0fe5a354ca24b3","sha256":"417860b9520d81127a479a785c7886a30de02751f33787a2daa8bca21ac81bed"},"dob":{"date":"1990-07-09T12:14:13Z","age":28},"registered":{"date":"2017-12-26T19:41:16Z","age":0},"phone":"(84) 5181-4592","cell":"(23) 6323-6609","id":{"name":"","value":null},"picture":{"large":"https://randomuser.me/api/portraits/men/42.jpg","medium":"https://randomuser.me/api/portraits/med/men/42.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/men/42.jpg"},"nat":"BR"}],
      page: 1,
      seed: 1,
      //   error: null,
      refreshing: false,
    };
  }

  state = {};

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          //   error: res.error || null,
          loading: false,
          refreshing: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          // error,
          loading: false,
        });
      });
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true,
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  };

  renderSeparator = () => (
    <View
      style={{
        height: 1,
        width: '79%',
        backgroundColor: '#CED0CE',
        marginLeft: '21%',
      }}
    />
  );

  renderHeader = () => <SearchBar placeholder="Type Here..." lightTheme round />;

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderLeftElement(item) {
    const thumbNail = item.picture.thumbnail && { uri: item.picture.thumbnail };
    const status = 'orange';
    return (
      <View style={styles.leftElementContainer}>
        <View style={styles.leftElementAvatarView}>
          <Avatar size="small" rounded source={thumbNail} activeOpacity={0.7} />
        </View>
        <View style={styles.leftElementStatusView}>
          <Icon
            type="material-community"
            name="brightness-1" // "checkbox-blank-circle-outline"
            size={14}
            color={status}
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <Screen>
        <StatusBar backgroundColor="#F5F5F5" barStyle="dark-content" />
        <NavBar
          navLeft={
            <TouchableOpacity onPress={this.iconPress}>
              <Icon name="account-outline" type="material-community" color="#2E88FF" size={24} />
            </TouchableOpacity>
          }
          navTitle={<Text style={styles.titleStyle}>Messages</Text>}
          navRight={
            <TouchableOpacity onPress={this.logoPress}>
              <Icon
                name="information-outline"
                type="material-community"
                color="#2E88FF"
                size={24}
              />
            </TouchableOpacity>
          }
        />
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              // rightElement={<Text style={{ flex: 1, backgroundColor: 'red' }}>Hellow</Text>}
              title={
                // <View style={styles.rightContainer} >
                <View style={styles.rightContainerTopView}>
                  <View>
                    <Text style={styles.rightContainerTopPaneText}>
                      {item.name.first} {item.name.last}
                    </Text>
                  </View>
                  <View style={[styles.rightContainerTopPane2, styles.badgeView]}>
                    <Badge
                      style={styles.badgeView}
                      containerStyle={{ backgroundColor: '#43D35D', margin: 0, padding: 0 }}
                    >
                      <Text style={styles.badgeText}>{item.registered.age}</Text>
                    </Badge>
                  </View>
                </View>
                // </View>
              }
              subtitle={
                <View style={styles.rightContainerBottomView}>
                  <View style={{}}>
                    <Text
                      style={styles.rightContainerBottomPaneText}
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {item.email}
                    </Text>
                  </View>
                  <View style={styles.rightContainerBottomPane}>
                    <Text
                      style={
                        item.dob.age !== 28
                          ? styles.rightContainerBottomPane2Text
                          : styles.rightContainerBottomPane2LongText
                      }
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {item.dob.age === 28 ? 'Few moments ago..' : 'Today'}
                    </Text>
                  </View>
                </View>
              }
              containerStyle={{
                // borderBottomWidth: 0,
                borderColor: '#FFF',
                paddingLeft: 15,
                // paddingTop: 15,
                // paddingBottom: 10,
                // backgroundColor: 'red',
                borderBottomWidth: 1,
                borderBottomColor: '#CED0CE',
                margin: 0,
              }}
              leftElement={this.renderLeftElement(item)}
            />
          )}
          titleStyle={{ borderBottomWidth: 1, borderBottomColor: '##CED0CE' }}
          subTitleStyle={{ borderBottomWidth: 1, borderBottomColor: '##CED0CE' }}
          keyExtractor={(item) => item.email}
          // ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={10}
        />
      </Screen>
    );
  }
}

ChatList.propTypes = {
  logoPress: PropTypes.func.isRequired,
  iconPress: PropTypes.func.isRequired,
};

const mapStateToProps = (/* state */) => ({});

const mapDispatchToProps = (/* dispatch */) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatList);
