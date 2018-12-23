import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
   FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
const api_key = process.env.GOOGLE_API;

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      lat: 47.884381,
      long: -122.281640,
      data: [],
      meal: null,
    }
    this.pickMeal = this.pickMeal.bind(this);
  }
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    Promise.all([this.getCurrentLocation(), this.getRestaurant()]);
  }

  getCurrentLocation() {
    this.setState({loading: true});
    navigator.geolocation.getCurrentPosition((position) => {
    const latitude = Number(position.coords.latitude.toFixed(6));
    const longitude = Number(position.coords.longitude.toFixed(6));
    this.setState({lat: latitude, long: longitude, loading: false});
    });
  }



  getRestaurant() {
    this.setState({loading: true});
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.state.lat},${this.state.long}&radius=500&type=restaurant&key=######`
    fetch(url).
    then(res => res.json()).
    then(res=> {
      this.setState({data: res.results, loading:false});
    }).catch(error => {
      console.log(error);
      this.setState({
        loading: false
      });
    });
  }



  displayData() {
    return this.state.data.map((el, idx)=> <Text key={idx}>{el.name}</Text>);
  }

  pickMeal() {
    this.getRestaurant();
    const data = this.state.data;
    this.setState({meal: data[Math.floor(Math.random() * data.length)].name});
  }

  render() {
    const meal = this.state.meal;
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <Text style={styles.bigText}>Loading...</Text>
      </View>

      );
    }
    return (
      <View style={styles.container}>
        <Button title='Pick a meal' onPress={this.pickMeal}/>
        <Text style={styles.bigText}>{meal}</Text>
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
