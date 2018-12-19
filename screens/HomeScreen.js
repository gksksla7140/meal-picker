import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
    }
  }
  static navigationOptions = {
    header: null,
  };

  displayFood() {
   
    this.setState({display: !this.state.display});
  }

  render() {
    const food = this.state.display ? <Text style={styles.bigText}> McDDD</Text> : null;
    return (
      <View style={styles.container}>
        <Button
          style={styles.button}
          title="What Should I Eat" onPress={this.displayFood.bind(this)}/>
          {food}
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

  
  },
  button: {
    
    margin: 20,
    paddingTop: 20,
    backgroundColor: 'red',
  },
  bigText: {
       fontSize: 50,
       fontWeight: 'bold',
  }

});
