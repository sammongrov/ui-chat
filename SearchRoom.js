import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { iOSColors } from 'react-native-typography';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppUtil from '@mongrov/utils'; 
import { Text, Screen, NavBar, Avatar, Icon } from '@ui/components';
import { Colors } from '@ui/theme_default';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import { styles } from 'react-native-theme';
// import DBManager from '../app/DBManager';
import {DBManager} from 'app-module';
//import Constants from '../app/model/constants';
 import  {Constants} from'app-module';
 import {Application} from '@mongrov/config';

// const styles = StyleSheet.create({});

// const list = [
//   {
//     id: '0',
//     roomName: 'Peter Paul',
//     roomDetails: '@peter',
//     avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
//   },
//   {
//     id: '1',
//     roomName: 'Chris Nolan',
//     roomDetails: '@chris',
//     avatar_url:
//       'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=707b9c33066bf8808c934c8ab394dff6',
//   },
//   {
//     id: '2',
//     roomName: 'John Smith',
//     roomDetails: '@john',
//     avatar_url: 'https://d3iw72m71ie81c.cloudfront.net/female-17.jpg',
//   },
//   {
//     id: '3',
//     roomName: 'Chris Jackson',
//     roomDetails: '@jackson',
//     avatar_url:
//       'https://tinyfac.es/data/avatars/7D3FA6C0-83C8-4834-B432-6C65ED4FD4C3-500w.jpegerror',
//   },
//   {
//     id: '4',
//     roomName: '# General',
//     roomDetails: 'John, Raj, Ediwin & 15 others',
//   },
//   {
//     id: '5',
//     roomName: '# Marketing Team',
//     roomDetails: 'Eddy, Sam, Ediwin & 5 others',
//   },
//   {
//     id: '6',
//     roomName: 'John Smith',
//     roomDetails: '@john',
//     avatar_url: 'https://d3iw72m71ie81c.cloudfront.net/female-17.jpg',
//   },
//   {
//     id: '7',
//     roomName: 'Chris Jackson',
//     roomDetails: '@jackson',
//     avatar_url: 'https://tinyfac.es/data/avatars/7D3FA6C0-83C8-4834-B432-6C65ED4FD4C3-500w.jpeg',
//   },
// ];

class SearchRoom extends Component {
  // static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    // this.logoPress = this.props.logoPress;
    // this.iconPress = this.props.iconPress;
    const { initSearch } = props;
    this.chat = DBManager._taskManager.chat;
    this.state = {
      dataSource: [],
      search: initSearch,
      searchText: '',
    };
    this._getAllGroupsCallback = this._getAllGroupsCallback.bind(this);
    this._createGroupCallback = this._createGroupCallback.bind(this);
    this._joinGroupCallback = this._joinGroupCallback.bind(this);
    this.logoPress = this.logoPress.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.itemPress = _.once(this.itemPress.bind(this));
    console.log('INIT SEARCH', initSearch);
  }

  // state = {};

  componentDidMount() {
    this.searchGroups('');
  }

  onTextChange(searchText) {
    this.setState({ searchText }, () => this.searchGroups(searchText));
    // this.searchGroups(this.state.searchText);
  }

  keyExtractor = (item) => item._id;

  searchGroups(keyword) {
    this.chat.searchUserOrGroup(keyword, this._getAllGroupsCallback);
  }

  logoPress() {
    const { search } = this.state;
    if (search) {
      this.searchGroups('');
    }
    this.setState({ search: !search });
  }

  itemPress(groupFrom, groupName, groupId) {
    Keyboard.dismiss();
    this.createGroup(groupFrom, groupName, groupId);
  }

  // searchGroups(keyword) {
  //   this.chat.searchUserOrGroup(keyword, this._getAllGroupsCallback);
  // }

  createGroup(groupFrom, groupName, groupId) {
    if (groupFrom && groupFrom === 'user') {
      this.chat.createDirectMessage(groupName, this._createGroupCallback);
    } else if (groupFrom && groupFrom === 'room') {
      this.chat.joinGroup(groupId, (err, res) => this._joinGroupCallback(err, res, groupId));
    } else {
      // Actions.ChatRoom({ roomInfo: groupId });
    }
  }

  _createGroupCallback(err, res) {
    if (res) {
      const groupObj = DBManager.group.findById(res.rid);
      if (groupObj) {
        Actions.replace('ChatRoom', { roomInfo: groupObj, hideTabBar: true });
      }
    }
  }

  // res is boolean
  _joinGroupCallback(err, res, groupId) {
    if (res) {
      Actions.ChatRoom({ groupId });
    }
  }

  _getAllGroupsCallback(data, status) {
    const _self = this;
    if (status === 'success') {
      const dataSource = _self._groupsToItems(data);
      _self.setState({ dataSource });
    }
  }

  _groupsToItems(groupsArr) {
    const items = groupsArr.map((group) => {
      if (group.username) {
        // from user
        return {
          _id: AppUtil.createGuid(),
          name: group.username,
          title: group.name,
          type: Constants.G_DIRECT,
          status: group.status,
          avatar: this._getGroupAvatar(group.username),
          _from: 'user',
        };
      }
      if (group.t) {
        // from room
        return {
          _id: group._id,
          name: group.name,
          title: group.topic || group.name,
          type: group.t,
          avatar: this._getGroupAvatar(group.name),
          _from: 'room',
        };
      }
      return group;
    });
    return items;
  }

  _getGroupAvatar(name) {
    return `${Application.urls.SERVER_URL}/avatar/${name}`;
  }

  _renderSearchNavbar() {
    const { searchText } = this.state;
    return (
      <NavBar
        leftComponent={
          <TouchableOpacity
            onPress={Actions.pop}
            style={[styles.navSideButtonDimension, styles.alignJustifyCenter]}
          >
            <Icon name="chevron-left" type="material-community" color={Colors.NAV_ICON} size={36} />
          </TouchableOpacity>
        }
        titleComponent={
          <TextInput
            style={{ width: '100%', color: '#000' }}
            autoCorrect={false}
            autoFocus={true}
            placeholder="Search member / group"
            // placeholderTextColor="#fff"
            onChangeText={this.onTextChange}
            value={searchText}
            underlineColorAndroid="transparent"
          />
        }
        rightComponent={
          <TouchableOpacity
            onPress={this.logoPress}
            style={[
              styles.navSideButtonDimension,
              styles.alignJustifyCenter,
              styles.paddingRight10,
            ]}
          >
            <Icon name="close" type="material-community" color={Colors.NAV_ICON} size={30} />
          </TouchableOpacity>
        }
      />
    );
  }

  _renderSearchRoomNavbar() {
    return (
      <NavBar
        leftComponent={
          <TouchableOpacity
            onPress={Actions.pop}
            style={[styles.navSideButtonDimension, styles.alignJustifyCenter]}
          >
            <Icon name="chevron-left" type="material-community" color={Colors.NAV_ICON} size={36} />
          </TouchableOpacity>
        }
        titleText="Discover"
        rightComponent={
          <TouchableOpacity
            onPress={this.logoPress}
            style={[
              styles.navSideButtonDimension,
              styles.alignJustifyCenter,
              styles.paddingRight10,
            ]}
          >
            <Icon name="magnify" type="material-community" color={Colors.NAV_ICON} size={30} />
          </TouchableOpacity>
        }
      />
    );
  }

  renderItem = ({ item }) => {
    const avatarURL = item.avatar || item.avatarURL;
    const roomDetails = item.type === 'd' ? `@${item.name}` : `#${item.name}`;
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}
        onPress={() => this.itemPress(item._from, item.name, item._id)}
      >
        <Avatar avatarUrl={avatarURL} avatarName={item.name} avatarSize={50} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: iOSColors.lightGray,
            paddingVertical: 15,
            marginLeft: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              marginRight: 10,
            }}
          >
            <Text
              numberOfLines={1}
              style={{ fontSize: 16, fontWeight: '400', color: iOSColors.black }}
            >
              {AppUtil.capitalizeString(item.name)}
            </Text>
            <Text
              numberOfLines={1}
              style={{ fontSize: 14, fontWeight: '500', color: iOSColors.gray }}
            >
              {roomDetails}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { search, dataSource } = this.state;
    const Navbar = search ? this._renderSearchNavbar() : this._renderSearchRoomNavbar();
    return (
      <Screen>
        {Navbar}
        <FlatList
          keyboardShouldPersistTaps="always"
          keyExtractor={this.keyExtractor}
          data={dataSource}
          renderItem={this.renderItem}
        />
      </Screen>
    );
  }
}

SearchRoom.propTypes = {
  // logoPress: PropTypes.func.isRequired,
  // iconPress: PropTypes.func.isRequired,
  initSearch: PropTypes.bool,
};
SearchRoom.defaultProps = {
  initSearch: false,
};

const mapStateToProps = (/* state */) => ({});

const mapDispatchToProps = (/* dispatch */) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchRoom);
