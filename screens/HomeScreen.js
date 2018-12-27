import React from 'react';
import { Rating, Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';


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

  renderMeal = () => {
    const meal = this.state.meal;
    debugger
    return (
      <View style={{height: 500}}>
        <Text>{meal.name}</Text>
      <Text>{`address: ${meal.vicinity}`}</Text>
        <Image 
         style={{width: 50, height: 50}}
        source={{uri: meal.icon}}/>
        <Text>{`Open: ${meal.opening_hours.open_now? 'Open': 'Closed'}`}</Text>
        <Rating
          type="star"
          fractions={1}
          startingValue={meal.rating}
          imageSize={40}
          style={{ paddingVertical: 10 }}
        />
        <Text>{'$'.repeat(meal.price_level)}</Text>
      </View>

    );

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
    let url = `https://meal-picker.herokuapp.com/google-places?location=${this.state.lat},${this.state.long}`
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




  pickMeal =() => {
    this.getRestaurant();
    const data = this.state.data;
    this.setState({meal: data[Math.floor(Math.random() * data.length)]});
  }

  render() {
    // if loading
    if (this.state.loading) {
      return (
       <View style={[styles.container]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>

      );
    }
    
    const meal = this.state.meal ? this.renderMeal() : <View style={{height: 500}}></View>;
    // if not loading
    return (
      <View style={styles.container}>
          {meal}
        <Button 
        title='Pick a meal' 
        onPress={this.pickMeal} borderRadius={25}  
        color='white'
        containerViewStyle={{borderRadius:25}}
        titleStyle={{ fontWeight: "700" }}
        buttonStyle = {
          {
            width: 155,
            height: 45,
            borderRadius: 25,
            backgroundColor: "rgb(247, 159, 121)",
            borderColor: "transparent",
          }
        }        
        />
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
  buttonContainer: { 
  },
  bigText: {
       fontSize: 50,
       fontWeight: 'bold',
  }

});
