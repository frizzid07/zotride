import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

// Styles
import { submit } from "../common/button";

const Landing = ({ navigation }) => {
  const [isRegisteredDriver, setRegisteredDriver] = useState(isDriver());

  function isDriver() {
    // This should have logic to check whether a user is already a driver
    return false;
  }

  function driverRole() {
    //Checking if The User is a registered Driver
    console.log("Drive Role Function Called");
    if (isRegisteredDriver) {
      navigation.navigate("Driver");
    } else {
      navigation.navigate("DriverRegistration");
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
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
