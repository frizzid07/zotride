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
    console.log(`In rides ${JSON.stringify(route.params.rides)}`);
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
                            <Text style={{fontWeight: "bold"}}>{ride.startLocation.description}</Text>
                        </Text>
                        <Text> to </Text>
                        <Text style={styles.location}>
                            <Text style={{fontWeight: "bold"}}> {ride.endLocation.description}</Text>
                        </Text>
                        </View>
                        <View style={styles.rideContainer}>
                        <Text style={styles.driver}>
                            Ride: <Text style={{fontWeight: "bold"}}>{driver?.driver ? driver?.driver?.vehicleInformation[0]?.vehicleCompany
+' '+driver?.driver?.vehicleInformation[0]?.vehicleModel : ''}</Text>{'\n\n'}
                            Driver: <Text style={{fontWeight: "bold"}}>{driver?.user ? driver?.user?.firstName+' '+driver?.user?.lastName : ''}</Text>
                        </Text>
                        <Text style={styles.capacity}>
                            Starts at{'\n'}<Text style={{fontWeight: "bold"}}>{new Date(ride.startTime).toLocaleString(undefined, {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'long',
                              hour: 'numeric',
                              minute: 'numeric',
                              timeZone: 'America/Los_Angeles'
                            })}</Text>
                        </Text>
                        </View>
                        <View style={styles.rideContainer}>
                        <Text style={styles.capacity}>Open Seats: <Text style={{fontWeight: "bold"}}>{ride.capacity}</Text></Text>
                        <Text style={styles.capacity}>
                            Fare: <Text style={{fontWeight: "bold"}}>${ride.rideCost}</Text>
                        </Text>
                        <Text style={[styles.driver, {flex: 1}]}>
                        <Pressable style={[submit, {fontSize: 20, minWidth: 100, backgroundColor: 'green'}]} onPress={() => {}}>
                            <Text style={[styles.text, {fontSize: 20, color: '#fff'}]}>Book</Text>
                        </Pressable>
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
        fontSize: 28,
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
        padding: 8,
        margin: 8,
        borderColor: 'black'
    },
    rideContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 8,
      },
      location: {
        fontSize: 15,
        marginLeft: 5,
        flex: 2
      },
      driver: {
        fontSize: 15,
        marginLeft: 5,
        flex: 2
      },
      capacity: {
        fontSize: 15,
        marginRight: 5,
        flex: 1
      }
  });