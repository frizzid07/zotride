import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";

import SingleRide from "../common/SingleRide";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

// Styles
import { submit } from "../common/button";
import { AuthContext } from "../../server/context/authContext";
import { NGROK_TUNNEL } from "@env";

const Driver = ({ navigation }) => {
  const context = useContext(AuthContext);
  const [hasActive, setHasActive] = useState(false);
  const [activeRide, setActiveRide] = useState({});

  async function checkActiveRideDriver() {
    console.log("Checking if Driver has an Active ride");
    if(context.user.activeDriverRide) {
      try {
        console.log('Debug');
        console.log('Debug');
        console.log('Debug');
        const response = await fetch(NGROK_TUNNEL + `/getRide?rideId=${context.user.activeDriverRide}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        console.log(response.ok);
        console.log('Debug');
        console.log('Debug');
        console.log('Debug');
        console.log('Debug');
        const rdata = await response.json();
        console.log(rdata);
        console.log('Debug');
        setActiveRide(rdata.ride);
        setHasActive(true);
    } catch(err) {
      console.log(err);
    }
  } else {
      try {
        console.log('Debug');
        console.log('Debug');
        console.log('Debug');
        const response = await fetch(NGROK_TUNNEL + `/findActiveRide?driverId=${context.user._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        console.log(response.ok);
        console.log('Debug');
        console.log('Debug');
        console.log('Debug');
        console.log('Debug');
        console.log('Debug');
        const result = await response.json();
        console.log(result);
        console.log('In Active Ride');
        console.log('Debug');

        if (result.ride) {
          console.log("Current Driver has Active Ride");
          setActiveRide(result.ride);
          setHasActive(true);
        } else {
          console.log("Current Driver has no Active Ride");
          setHasActive(false);
        }
      } catch (err) {
        console.log("Some backend error");
        console.log(err);
      }
    }
  }

  useEffect(() => {
    checkActiveRideDriver();
  }, []);
  
  useEffect(() => {
    checkActiveRideDriver();
  }, [context]);

  useEffect(() => {
    const refreshListener = navigation.addListener('focus', () => {
      checkActiveRideDriver();
    });

    return refreshListener;
  }, [navigation]);

  async function editRide() {
    try {
      console.log('Debug');
      console.log('Debug');
      const response = await fetch(NGROK_TUNNEL + `/findActiveRide?driverId=${context.user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log(response.ok);
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      const result = await response.json();
      console.log(result);
      console.log('Debug');

      if (result.ride) {
        console.log(`New Data ${JSON.stringify(result.ride)}`);
        navigation.navigate('ListRide', {ride: result.ride});
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function endRide() {
    try {
      console.log('Debug');
      console.log('Debug');
      const response = await fetch(NGROK_TUNNEL + `/endRide?rideId=${activeRide._id}&userId=${context.user._id}`, {
        method: "GET"
      });
      console.log(response.ok);
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      if(response.ok) {
        alert("Trip Ended Successfully!");
        context.user.activeDriverRide = null;
        context.user.past_drives = [...context.user.past_drives, activeRide._id];
        setHasActive(false);
        navigation.pop();
      }
    } catch(error) {
      console.log("Error in ending ride " + error);
    }
  }
  
  async function cancelRide() {
    try {
      console.log('Debug');
      const response = await fetch(NGROK_TUNNEL + `/deleteRide?rideId=${activeRide._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log(response.ok);
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      const result = await response.json();
      console.log(result);
      console.log('Debug');

      if (result.deleted) {
        console.log("Ride Deleted");
        context.user.activeDriverRide = null;
        setHasActive(false);
        navigation.pop();
      } else {
        console.log(`Could not Delete due to ${result.error}`);
      }
    } catch (err) {
      console.log("Error in deleting " + err);
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={[styles.text, {marginTop: '-2%'}]}>Welcome, {context.user.firstName}</Text>
        {!hasActive && (
          <View style={{ width: "75%", marginTop: 25 }}>
            <Pressable
              style={submit}
              onPress={() => navigation.navigate("ListRide")}
            >
              <Text style={styles.text}>Start a New Trip</Text>
            </Pressable>
          </View>
        )}
        {hasActive && (
          <View style={{ width: "100%", marginTop: 25 }}>
            <Text style={[styles.text, {fontSize: 20}]}>Your Current Ride</Text>
            <SingleRide ride={activeRide}></SingleRide>
            <View style={{ width: "60%", marginTop: '1%', alignSelf: 'center' }}>
              <Pressable style={[submit, { backgroundColor: 'rgba(0, 74, 172, 0.8)', padding: 0 }]} onPress={editRide}>
                <Text style={[styles.text, { color: 'white', fontSize: 20 }]}>Modify Trip</Text>
              </Pressable>
              <Pressable style={[submit, { backgroundColor: "rgba(235, 210, 95, 0.8)", marginTop: -5 }]} onPress={endRide}>
                <Text style={[styles.text, { color: 'black', fontSize: 20 }]}>End Trip</Text>
              </Pressable>
              <Pressable style={[submit, { backgroundColor: "rgba(194, 24, 7, 0.8)", marginTop: -5 }]} onPress={cancelRide}>
                <Text style={[styles.text, { color: 'white', fontSize: 20 }]}>Cancel Trip</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Driver;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  bg: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  text: {
    fontSize: 25,
    color: "#000",
  },
  innerContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  logo: {
    width: "70%",
    height: undefined,
    aspectRatio: 2.5
  },
});