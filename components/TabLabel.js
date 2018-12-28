import React from 'react';
import {
    Image,
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Colors from '../constants/Colors';

export default class TabLabel extends React.Component {
  render() {
    return (
      <Text
        size={26}
        style={{ 
            color:this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault,
            textAlign: 'center',



        }}
      >{this.props.name }</Text>
    );
  }
}