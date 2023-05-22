import {
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    Pressable,
    Alert,
    TextInput,
    ScrollView,
    TouchableOpacity
  } from "react-native";
import React, { useState, useContext, useEffect } from "react";

// Images
import background from "../../assets/background.jpg";

// Common
import { submit } from "../common/button";

import { NGROK_TUNNEL } from "@env";

const Rides = ({navigation, route}) => {
    const [rides, setRides] = useState(route.params.rides);
    const [drivers, setDrivers] = useState([]);

    const fetchDrivers = async () => {
        const driverData = [];
    
        for (const ride of rides) {
          try {
            const response = await fetch(
              NGROK_TUNNEL + `/getDriver?driverId=${ride.driverId}`,
              {
                method: "GET",
              }
            );
            console.log(response.ok);
            if (response.ok) {
              const driver = await response.json();
              console.log(driver);
              driverData.push(driver);
            } else {
              console.error("Failed to fetch driver data");
            }
          } catch (error) {
            console.error(error);
          }
        }
    
        setDrivers(driverData);
      };

      useEffect(() => {
          fetchDrivers();
      }, []);
    
      return (
        <View style={styles.container}>
          <Image style={styles.bg} source={background} />
            <Text style = {[styles.text, {marginBottom: 15, marginTop: 75}]}>Available Rides</Text>
                {
                rides.length === 0 ? (
                    <Text style = {[styles.text, {fontSize: 25, margin: 20, color: 'gray'}]}>No available rides</Text>
                ) : (
                rides.map((ride, index) => {
                    const driver = drivers[index];
                    return (
                    <View key={index} style={styles.rideBox}>
                        <View style={styles.rideContainer}>
                        <Text style={styles.location}>
                            <Text style={{fontWeight: "bold"}}>{ride.startLocation}</Text> to 
                            <Text style={{fontWeight: "bold"}}> {ride.endLocation}</Text>
                        </Text>
                        <Text style={styles.capacity}>Seats: <Text style={{fontWeight: "bold"}}>{ride.capacity}</Text></Text>
                        </View>
                        <View style={styles.rideContainer}>
                        <Text style={styles.driver}>
                            Ride: <Text style={{fontWeight: "bold"}}>{driver?.driver ? driver?.driver?.vehicleInformation[0]?.vehicleCompany
+' '+driver?.driver?.vehicleInformation[0]?.vehicleModel : ''}</Text>
                        </Text>
                        <Text style={styles.capacity}>
                            Fare: <Text style={{fontWeight: "bold"}}>${ride.rideCost}</Text>
                        </Text>
                        </View>
                        <View style={styles.rideContainer}>
                        <Text style={styles.driver}>
                            Driver: <Text style={{fontWeight: "bold"}}>{driver?.user ? driver?.user?.firstName+' '+driver?.user?.lastName : ''}</Text>
                        </Text>
                        <Text style={styles.capacity}>
                            Starts at <Text style={{fontWeight: "bold"}}>{ride.startTime.slice(11, 16)}</Text>
                        </Text>
                        </View>
                    </View>
                    );
                })
            )}
            <Pressable style={[submit, {marginTop: 15, marginLeft: 80, marginRight: 80, fontSize: 20}]} onPress={() => {navigation.navigate("FindRide")}}>
                <Text style={{fontSize: 20}}>Change Ride Preferences</Text>
            </Pressable>
        </View>
      );
};

export default Rides;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%"
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
      },
      text: {
        fontSize: 32,
        color: '#000',
        alignSelf: "center"
    },
    innerContainer: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "flex-start",
  },
    bg: {
      position: "absolute",
      top: 0,
      width: "100%",
      height: "100%",
      zIndex: -1,
    },
    rideBox: {
        backgroundColor: '#ffffff',
        padding: 10,
        margin: 10,
        borderColor: 'black'
    },
    rideContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
      },
      location: {
        fontSize: 18,
        marginLeft: 5,
        flex: 2
      },
      driver: {
        fontSize: 18,
        marginLeft: 5,
        flex: 2
      },
      capacity: {
        fontSize: 18,
        marginRight: 5,
        flex: 1
      }
  });