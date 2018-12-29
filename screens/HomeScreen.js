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
      noResult: false,
    }
  }
  static navigationOptions = {
    header: null,
  };



  renderMeal = () => {
    const meal = this.state.meal;
    const open = meal.opening_hours.open_now ? 
    <Text style={{color: '#91e567'}} h3>OPEN</Text> :
    <Text style={{color: '#e25a48'}} h3>CLOSED</Text> 
    const price_level = meal.price_level ?
    <Text style={{color: '#91e567', marginBottom: 5}} h4>{'$'.repeat(meal.price_level)}</Text> :
    <Text style={{color: '#e25a48', marginBottom: 5}} h4>Price range not given</Text> 

    return (
      <View style={[{height: 500}]}>
      <View style={[{ height: 450, width: 350, borderWidth: 1, borderColor: Colors.tintColor, paddingBottom: 20, borderRadius: 25}, 
        styles.container3]}>
        <Text style={{textAlign: "center", marginBottom: 5}} h2>{meal.name}</Text>
        <Text style={{textAlign: "center", marginBottom: 5}}>{meal.vicinity}</Text>
        {open}
        <Rating
          type="star"
          readonly
          fractions={1}
          startingValue={meal.rating}
          imageSize={30}
          style={{ paddingVertical: 10 }}
        /> 
        {price_level}
        <Image 
         style={{width: 50, height: 50}}
        source={{uri: meal.icon}}/>
      </View>
      </View>

    );

  }

  handleClick=(e)=> {
    e.preventDefault();
    this.getRestaurant().then(()=> {this.pickMeal()}); 
  }

  getCurrentLocation = async () => {
    this.setState({loading: true});
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
    this.setState({loading: true});
    await this.getCurrentLocation();
    let url = `https://meal-picker.herokuapp.com/google-places?location=${this.state.lat},${this.state.long}`
    // let url = 'https://meal-picker.herokuapp.com/google-places?location=47.884381,-122.281640';
   await  fetch(url).
    then(res => res.json()).
    then(res=> {
      if (res.status === 'ZERO_RESULTS') {
        this.setState({noResult: true, loading: false})
      } else {
        this.setState({data: res.results, loading:false, noResult: false});
      }
    }).catch(error => {
      console.log(error);
      this.setState({
        loading: false
      });
    });
  }




  pickMeal =() => {
    const data = this.state.data;
    this.setState({meal: data[Math.floor(Math.random() * data.length)]});
  }

  noResult = () => {
    return (
        <View style={[styles.container2, {height: 500}]}>
          <Text style={{color: '#ff7575', fontSize: 20, marginBottom: 30}}>
            No place was found around the area
          </Text>
          <Icon.Ionicons
              name={
                  Platform.OS === 'ios'
                ? `ios-alert`
                : 'md-alert'
              }
              size={100}
              style={{ marginBottom: -3 }}
              color={Colors.tintColor}
          />
      </View>


    );
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

    let meal;
      if (this.state.meal) {
        meal =  this.renderMeal();
      } else if (this.state.noResult) {
        meal =  this.noResult();
      } else {
        meal =  this.instruction();
      }
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
  container3: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
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
