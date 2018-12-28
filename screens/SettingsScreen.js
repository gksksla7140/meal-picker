import React from 'react';
import { Rating, Button, Text } from 'react-native-elements';
import Colors from '../constants/Colors';
import {
  Image,
  ActivityIndicator,
  StyleSheet,
  View,
  Platform
} from 'react-native';

export default class SettingsScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style ={{color: Colors.tintColor }} h2>Work in Progress</Text>

      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  
});
