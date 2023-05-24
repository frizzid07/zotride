import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";

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

  useEffect(async () => {
    console.log("Checking if Driver has an Active ride");
    try {
      const response = await fetch(NGROK_TUNNEL + "/findActiveRide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ driverId: context.user._id }),
      });

      const result = await response.json();
      console.log(result);

      if (result.found) {
        console.log("Current Driver has Active Ride");
        setHasActive(true);
      } else {
        console.log("Current Driver has no Active Ride");
        setHasActive(false);
      }
    } catch (err) {
      console.log("Some backend error");
      console.log(err);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={styles.text}>Welcome, {context.user.firstName}</Text>
        <Pressable
          style={[submit, { marginTop: 20 }]}
          onPress={() => navigation.navigate("ListRide")}
        >
          <Text style={styles.text}>Start a new trip</Text>
        </Pressable>
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
    width: "40%",
    height: undefined,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: "#ffde59",
    borderRadius: 5,
    marginBottom: 40,
  },
});
