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
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext } from "react";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

// Common
import { submit } from "../common/button";
import { input } from "../common/input";

import { NGROK_TUNNEL } from "@env";
import { AuthContext } from "../../server/context/authContext";

const ListRide = ({ navigation }) => {
  const context = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState(null);

  const [data, setData] = useState({
    rideId: "test",
    driverId: context.user._id,
    passengers: [],
    startLocation: "",
    endLocation: "",
    startTime: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
    rideCost: "",
    capacity: "",
  });

  function clearErrMsg() {
    setErrorMsg(null);
  }

  async function registerRide() {
    if (
      data.startLocation == "" ||
      data.endLocation == "" ||
      data.startTime == "" ||
      data.rideCost == "" ||
      data.capacity == ""
    ) {
      setErrorMsg("Please Enter All Fields");
      return;
    }

    console.log(data);
    try {
      const response = await fetch(NGROK_TUNNEL + "/listRide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const rdata = await response.json()

      if (rdata.added) {
        alert("Ride added successfully");
        console.log("Ride Added Successfully");
        navigation.navigate("Driver");
      } else {
        alert("Could not add ride");
      }
    } catch (error) {
      console.log("Some error in registering the Ride " + error);
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <ScrollView contentContainerStyle={styles.textContainer}>
        <TouchableOpacity>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={[styles.text, { marginBottom: 25 }]}>List a new Trip</Text>
        {errorMsg ? (
          <Text style={[styles.text, { color: "red", marginTop: -5 }]}>
            {errorMsg}
          </Text>
        ) : null}
        <Text style={styles.text}>EndPoints</Text>
        <TextInput
          style={input}
          placeholder="Start Location"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, startLocation: text })}
        />
        <TextInput
          style={input}
          placeholder="End Location"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, endLocation: text })}
        />
        <Text style={styles.text}>Other Details</Text>
        <TextInput
          style={input}
          placeholder="Ride Cost (USD)"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, rideCost: text })}
          keyboardType="number-pad"
        />
        <TextInput
          style={input}
          placeholder="Passengers"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, capacity: text })}
          keyboardType="number-pad"
        />
        <Pressable style={[submit, { marginTop: -5 }]}>
          <Text style={styles.text} onPress={registerRide}>
            Register
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default ListRide;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    height: "100%",
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
  text: {
    fontSize: 25,
    color: "#000",
  },
  logo: {
    width: "20%",
    height: undefined,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#ffde59",
    borderRadius: 5,
    marginBottom: 10,
  },
});
