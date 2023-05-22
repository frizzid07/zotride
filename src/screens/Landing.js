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
// import AsyncStorage from '@react-native-async-storage/async-storage';

const Landing = ({ navigation }) => {
  const context = useContext(AuthContext);
  // const token = route.params.userdata.token;

  async function isRegisteredDriver() {
    //Some API Call To check is user is a registered Driver
    console.log("Checking");
    console.log("Checking2");
    try {
      const response = await fetch(NGROK_TUNNEL + "/checkDriverReg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: context.user._id }),
      });

      const result = await response.json();
      console.log(result);

      if (result.found) {
        console.log("Current user is Registered Driver");
        return true;
      } else {
        console.log("Current user needs to register as a driver");
        return false;
      }
    } catch (err) {
      console.log("Some backend error");
      console.log(err);
    }
  }

  async function driverRole() {
    //Checking if The User is a registered Driver
    console.log("Drive Role Function Called");
    const checkDriver = await isRegisteredDriver();
    console.log(checkDriver);
    if (context.user.isDriver) {
      navigation.navigate("Driver");
    } else if (checkDriver) {
      context.user.isDriver = true;
      navigation.navigate("Driver");
    } else {
      navigation.navigate("DriverRegistration");
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Landing")}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, color: "#000", marginBottom: 20 }}>
          Welcome to ZotRide, {context.user.firstName}
        </Text>
        <Text style={{ fontSize: 25, color: "#000", marginBottom: 20 }}>
          Choose a Role
        </Text>
        <Pressable style={submit} onPress={driverRole}>
          <Text style={styles.text}>Driver</Text>
        </Pressable>
        <Pressable
          style={submit}
          onPress={() => navigation.navigate("Passenger")}
        >
          <Text style={styles.text}>Passenger</Text>
        </Pressable>
        <Pressable
          style={[submit, { minWidth: 100, minHeight: 30, borderRadius: 3 }]}
          onPress={context.logout}
        >
          <Text style={styles.text}>Logout</Text>
        </Pressable>
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
