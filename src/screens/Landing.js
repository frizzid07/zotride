import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  LogBox
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { NGROK_TUNNEL } from "@env";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

// Styles
import { submit } from "../common/button";

import { AuthContext } from "../../server/context/authContext";
import SingleRide from "../common/SingleRide";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Landing = ({ navigation }) => {
  const context = useContext(AuthContext);
  const [name, setName] = useState();
  const [isDriver, setIsDriver] = useState(false);
  const [hasActive, setHasActive] = useState(false);
  const [activeRide, setActiveRide] = useState({});
  const [hasActivePass, setHasActivePass] = useState(false);

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  const getUser = async () => {
    console.log("In Landing => Getting The User Data");
    let userVal = await AsyncStorage.getItem("user");
    if (userVal) {
      console.log("Got user");
      userVal = JSON.parse(userVal);
      setName(userVal.firstName);
      console.log(userVal.isDriver);
      if (userVal.isDriver === true) {
        setIsDriver(true);
      } else {
        console.log("User is not a driver");
      }
    } else {
      console.log("Didn't get user");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getUser();
  }, [context]);

  useEffect(() => {
    getUser();
  }, [isDriver]);

  useEffect(() => {
    const refreshListener = navigation.addListener('focus', () => {
      getUser();
    });

    return refreshListener;
  }, [navigation]);

  async function checkActiveRideDriver() {
    console.log("Checking if Driver has an Active ride");
    if(context.user.activeDriverRide !== null) {
      try {
        console.log('Debug');
        const response = await fetch(NGROK_TUNNEL + `/getRide?rideId=${context.user.activeDriverRide}`, {
          method: "GET"
        });
        console.log(response.ok);
        console.log('Debug');
        console.log('Debug');
        const rdata = await response.json();
        console.log(rdata);
        setActiveRide(rdata.ride);
        setHasActive(true);
    } catch(err) {
      console.log(err);
    }
  } else {
        if(!context.user.isDriver) {
          setHasActive(false);
          setIsDriver(false);
        } else {
          try {
        console.log('Debug');
        console.log('In here');
        const response = await fetch(NGROK_TUNNEL + `/findActiveRide?driverId=${context.user._id}`, {
          method: "GET"
        });
        console.log(response.ok);
        console.log('Debug');
        console.log('Debug');
        const result = await response.json();
        console.log(result);
        console.log('In Active Ride');

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
}

  async function checkActiveRide() {
    console.log("Checking if Passenger has an Active ride");
    if(context.user.isDriver) {      
      setIsDriver(true);
    } else {
      setIsDriver(false);
    }
  }

  useEffect(() => {
    checkActiveRide();
  }, [context]);

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

  async function checkActiveRidePass() {
    console.log("Checking if Passenger has an Active ride");
    if(context.user.activePassengerRides.length !== 0) {      
      setHasActivePass(true);
    } else {
      setHasActivePass(false);
    }
  }

  useEffect(() => {
    checkActiveRidePass();
  }, [context]);

  useEffect(() => {
    const refreshListener = navigation.addListener('focus', () => {
      checkActiveRidePass();
    });

    return refreshListener;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Landing")}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, color: "#000", marginBottom: '3%' }}>
          Welcome to ZotRide, {name}
        </Text>
        <Pressable
          style={submit}
          onPress={() => {
            navigation.navigate("FindRide");
          }}
        >
          <Text style={styles.text}>Find a new Ride</Text>
        </Pressable>
        {hasActivePass && (
          <Pressable style={[submit, {marginTop: 0}]} onPress={() => navigation.navigate('Passenger')}>
            <Text style={styles.text}>View Active Ride(s)</Text>
          </Pressable>
        )}
        {!isDriver && (
          <View>
            <Text style={{ fontSize: 25, color: "#000", marginTop: 30 }}>
              Enroll as a Driver with us
            </Text>
            <Pressable
              style={submit}
              onPress={() => {
                navigation.navigate("DriverRegistration");
              }}
            >
              <Text style={styles.text}>Register</Text>
            </Pressable>
          </View>
        )}
        {isDriver && !hasActive && (
          <View>
            <Text style={{ fontSize: 25, color: "#000", marginTop: 30, marginBottom: 15 }}>
              Start your journey with us
            </Text>
            <Pressable
              style={submit}
              onPress={() => {
                navigation.navigate("ListRide");
              }}
            >
              <Text style={styles.text}>List your Ride</Text>
            </Pressable>
          </View>
        )}
        {isDriver && hasActive && (
          <View style={{ width: "95%", marginTop: '4%' }}>
            <Text style={[styles.text, {fontSize: 20, marginLeft: '2%'}]}>Your Current Ride</Text>
            <SingleRide ride={activeRide}></SingleRide>
          </View>
        )}
      </View>
    </View>
  );
};

export default Landing;

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
  logo: {
    width: "60%",
    height: undefined,
    aspectRatio: 2.5
  },
});