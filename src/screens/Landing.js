import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { NGROK_TUNNEL } from "@env";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

// Styles
import { submit } from "../common/button";

import { AuthContext } from "../../server/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setDriver } from "mongoose";

const Landing = ({ navigation }) => {
  const context = useContext(AuthContext);
  const [name, setName] = useState();
  const [isDriver, setIsDriver] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      console.log("In Landing => cGetting The User Data");
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
    getUser();
  }, []);

  const isRegisteredDriver = async () => {
    console.log("Checking Driver");
    try {
      const response = await fetch(
        NGROK_TUNNEL + `/getDriver?driverId=${context.user._id}`,
        {
          method: "GET",
        }
      );
      const rdata = await response.json();
      console.log(rdata);
      console.log(response.ok);
      console.log("In Landing");
      if (rdata.driver !== null) {
        console.log("Driver Record found");
        return true;
      } else {
        try {
          const response2 = await fetch(NGROK_TUNNEL + "/driverRegistration", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: { userId: context.user._id } }),
          });
          console.log(response2.ok);
          console.log('Debug');
          const rdata2 = await response2.json();
          console.log(rdata2);
        } catch(error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  };

  const driverRole = async () => {
    //Checking if The User is a registered Driver
    console.log("Drive Role Function Called");
    if (context.user.isDriver) {
      console.log('Debug');
      console.log('Debug');
      const checkDriver = await isRegisteredDriver();
      console.log(checkDriver);
      if (checkDriver) navigation.navigate("Driver");
      else navigation.navigate("DriverRegistration");
    } else {
      navigation.navigate("DriverRegistration");
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Landing")}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, color: "#000", marginBottom: 30 }}>
          Welcome to ZotRide, {name}
        </Text>
        {/* <Text style={{ fontSize: 25, color: "#000", marginBottom: 20 }}>
          Choose a Role
        </Text> */}
        <Pressable
          style={submit}
          onPress={() => {
            navigation.navigate("FindRide");
          }}
        >
          <Text style={styles.text}>Find a Ride</Text>
        </Pressable>
        {!isDriver && (
          <View>
            <Text style={{ fontSize: 25, color: "#000", marginTop: 30 }}>
              Register as a Driver with us
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
    width: "40%",
    height: undefined,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: "#ffde59",
    borderRadius: 5,
    marginBottom: 40,
  },
});
