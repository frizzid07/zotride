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
          const response = await fetch(
              NGROK_TUNNEL + `/getDriver?driverId=${ride.driverId}`,
              {
                method: "GET",
              }
            );
            console.log(response.ok);
            console.log('Debug');
            if (response.ok) {
              console.log('Debug');
              console.log('Debug');
              const driver = await response.json();
              console.log(driver);
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
            
            <Text style={[styles.text, {marginBottom: 15}]}>Hello {context.user.firstName}, your ride to</Text>
            
            <Text style={[styles.text, {fontSize: 20, marginBottom: 15, marginTop: 5}]}>{ride.endLocation.description}</Text>
            <Text style={[styles.text, {fontSize: 15, marginBottom: 10}]}>in</Text>
            <Text style={styles.text}>{name}'s{'\n'}{car}</Text>
            <Text style={[styles.text, {fontSize: 15, marginTop: 10}]}>has been booked for</Text>
            
            <Text style={[styles.text, {marginTop: 10}]}>{new Date(ride.startTime).toLocaleString('en-US', options)}</Text>
            
            <Text style={[styles.text, {marginTop: 25, fontSize: 30}]}>Happy Journey!</Text>
            
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
        width: '25%',
        height: undefined,
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: '#ffde59',
        borderRadius: 5,
        marginBottom: 40
    }
});