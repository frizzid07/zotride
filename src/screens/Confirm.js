import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Button,
    Pressable,
    Alert,
    TouchableOpacity,
  } from "react-native";
  import React, { useState, useContext, useEffect } from "react";
  
  // Images
  import background from "../../assets/background.jpg";
  import logo from "../../assets/logo.png";
  
  // Common
  import { submit } from "../common/button";
  import { input } from "../common/input";
  
  import { AuthContext } from "../../server/context/authContext";
  import { NGROK_TUNNEL } from "@env";
  
  const Confirm = ({ navigation, route }) => {
    const context = useContext(AuthContext);
    const [ride, setRide] = useState(route.params?.ride);
    const [car, setCar] = useState();
    const [name, setName] = useState();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    useEffect(() => {
      async function getDetails() {
        try {
          console.log("Please bro");
          console.log('Debug');
          console.log('Debug');
          console.log('Debug');
          const response = await fetch(
              NGROK_TUNNEL + `/getDriver?driverId=${ride.driverId}`,
              {
                method: "GET",
              }
            );
            console.log(response.ok);
            console.log('Debug');
            console.log('Debug');
            console.log('Debug');
            if (response.ok) {
              const driver = await response.json();
              console.log(driver);
              console.log('Debug');
              console.log('Debug');
              console.log('Debug');
              setCar(driver?.driver?.vehicleInformation[0]?.vehicleCompany +
                  " " +
                  driver?.driver?.vehicleInformation[0]?.vehicleModel);
              setName(driver.user.firstName+' '+driver.user.lastName);
            } else {
              console.error("Failed to fetch driver data");
            }
          } catch (error) {
            console.error(error);
          }
      }
      getDetails();
    }, [])

    return (
        <View style = {styles.container}>
        <Image style={styles.bg} source={background}></Image>
        <View style = {styles.textContainer}>
            <TouchableOpacity>
            <Image style={styles.logo} source={logo} />
            </TouchableOpacity>
            
            <Text style={[styles.text, {marginBottom: 10, fontSize: 18}]}>Receipt for Ride #{ride._id}</Text>
            
            <Text style={[styles.text, {marginBottom: 10}]}>Hello {context.user.firstName}, your ride to</Text>
            
            <Text style={[styles.text, {fontSize: 20, marginBottom: 10, marginTop: 5}]}>{ride.endLocation.description}</Text>
            <Text style={[styles.text, {fontSize: 15, marginBottom: 8}]}>in</Text>
            <Text style={styles.text}>{name}'s{'\n'}{car}</Text>
            <Text style={[styles.text, {fontSize: 15, marginTop: 8}]}>has been booked for</Text>
            
            <Text style={[styles.text, {marginTop: 8}]}>{new Date(ride.startTime).toLocaleString('en-US', options)}</Text>
            
            <Text style={[styles.text, {marginTop: 15, fontSize: 30}]}>Happy Journey!</Text>

            <Pressable style={[submit, {marginTop: 15}]} onPress={() => navigation.navigate('Landing')}>
              <Text style={[styles.text, {fontSize: 20}]}>Back to Home</Text>
            </Pressable>
            
        </View>
        </View>
    );
  }

  export default Confirm;

  const styles = StyleSheet.create({

    container: {
        width: '100%',
        height: '100%'
    },
    textContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    bg: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
    },
    text: {
        fontSize: 25,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#000'
    },
    logo: {
      width: "65%",
      height: undefined,
      aspectRatio: 2.5
    },
});