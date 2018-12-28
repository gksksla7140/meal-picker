import React from 'react';
import { Rating, Button, Text } from 'react-native-elements';
import { Constants, Location, Permissions } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'expo';
import {
  Image,
  ActivityIndicator,
  StyleSheet,
  View,
  Platform
} from 'react-native';
import Colors from '../constants/Colors';


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      lat: null,
      long: null,
      data: [],
      meal: null,
    }
    this.pickMeal = this.pickMeal.bind(this);
  }
  static navigationOptions = {
    header: null,
  };



  renderMeal = () => {
    const meal = this.state.meal;
    return (
      <View style={[{height: 500}]}>
      <View style={[{ height: 450, width: 350, borderWidth: 1, borderColor: Colors.tintColor, paddingBottom: 20, borderRadius: 25}, styles.container2]}>
        <Text style={{textAlign: "center"}} h2>{meal.name}</Text>
        <Text>{`address: ${meal.vicinity}`}</Text>
        <Image 
         style={{width: 50, height: 50}}
        source={{uri: meal.icon}}/>
        <Text>{`Open: ${meal.opening_hours.open_now? 'Open': 'Closed'}`}</Text>
        <Rating
          type="star"
          readonly
          fractions={1}
          startingValue={meal.rating}
          imageSize={40}
          style={{ paddingVertical: 10 }}
        /> 
        <Text>{'$'.repeat(meal.price_level)}</Text>
      </View>
      </View>

    );

  }

  handleClick=()=> {
      // Promise.all([this.getCurrentLocation(), this.getRestaurant()]);
      this.getRestaurant();
      this.pickMeal();
  }

  getCurrentLocation = async () => {
    this.setState({loading: true});
    // navigator.geolocation.getCurrentPosition((position) => {
    //   debugger
    // const latitude = Number(position.coords.latitude.toFixed(6));
    // const longitude = Number(position.coords.longitude.toFixed(6));
    // this.setState({lat: latitude, long: longitude, loading: false});
    // });
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ lat: location.coords.latitude, long: location.coords.longitude });
  }



  getRestaurant= async () =>  {
    // 47.884375, -122.281699
    this.setState({loading: true});
     await this.getCurrentLocation();
    let url = `https://meal-picker.herokuapp.com/google-places?location=${47.884375},${-122.281699}`
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
    debugger
  }




  pickMeal =() => {
    this.getRestaurant();
    const data = this.state.data;
    this.setState({meal: data[Math.floor(Math.random() * data.length)]});
  }

  instruction = () => {
    return (
      <View style={[styles.container2, {height: 500}]}>
          <Text style={{color: Colors.tintColor, fontSize: 20, marginBottom: 30}}>
            Press the button below to pick a meal
          </Text>
          <Icon.Ionicons
              name={
                  Platform.OS === 'ios'
                ? `ios-pizza`
                : 'md-pizza'
              }
              size={100}
              style={{ marginBottom: -3 }}
              color={Colors.tintColor}
          />

      </View>
    );
  }

  render() {
    // if loading
    if (this.state.loading) {
      return (
       <View style={[styles.container]}>
        <ActivityIndicator size="large" color="#f79f79" />
      </View>

      );
    }
    
    const meal = this.state.meal ? this.renderMeal() : this.instruction();
    // if not loading
    return (
      <View style={styles.container}>
          {meal}
        <Button 
        title='Pick a meal' 
        onPress={this.handleClick} 
        borderRadius={25}  
        color='white'
        containerViewStyle={{borderRadius:25}}
        titleStyle={{ fontWeight: "700" }}
        buttonStyle = {styles.buttonStyle}        
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
  container2: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',


  },
  buttonContainer: { 
  },
  bigText: {
       fontSize: 50,
       fontWeight: 'bold',
  },
  buttonStyle:{
    width: 155,
    height: 45,
    borderRadius: 25,
    backgroundColor: "rgb(247, 159, 121)",
    borderColor: "transparent",
  }

});
