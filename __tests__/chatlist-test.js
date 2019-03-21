import React from 'react';
import renderer from 'react-test-renderer';
import { Alert } from 'react-native';
import ChatList from '../ChatList';

const logoPress = () => Alert.alert('Accepted');
const iconPress = () => Alert.alert('Accepted');

it('ChatList renders correctly', () => {
  const tree = renderer
    .create(<ChatList text="testing1" logoPress={logoPress} iconPress={iconPress} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
