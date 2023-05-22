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
import MapView from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import SetLocation from "../modals/SetLocation";

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

  const [isStartLocVisible, setStartLocVisible] = useState(false);
  const [isEndLocVisible, setEndLocVisible] = useState(false);

  const [startLocDesc, setStartLocDesc] = useState("Start Location");
  const [endLocDesc, setEndLocDesc] = useState("End Location");

  function startLocOpenHandler() {
    setStartLocVisible(true);
  }

  function startLocCloseHandler() {
    setStartLocVisible(false);
  }

  function endLocOpenHandler() {
    setEndLocVisible(true);
  }

  function endLocCloseHandler() {
    setEndLocVisible(false);
  }

  const [data, setData] = useState({
    rideId: "test",
    driverId: context.user._id,
    passengers: [],
    startLocation: {
      description: "",
      latitude: "",
      longitude: "",
    },
    endLocation: { description: "", latitude: "", longitude: "" },
    startTime: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
    rideCost: "",
    capacity: "",
  });

  function setStartLocation(object) {
    console.log(object);
    setStartLocDesc(object.description);
    setData({
      ...data,
      startLocation: {
        ...data.startLocation,
        description: object.description,
        latitude: object.latitude,
        longitude: object.longitude,
      },
    });
  }

  function setEndLocation(object) {
    console.log(object);
    setEndLocDesc(object.description);
    setData({
      ...data,
      endLocation: {
        ...data.endLocation,
        description: object.description,
        latitude: object.latitude,
        longitude: object.longitude,
      },
    });
  }

  function clearErrMsg() {
    setErrorMsg(null);
  }

  async function registerRide() {
    if (
      data.startLocation.description == "" ||
      data.endLocation.description == "" ||
      data.startTime == "" ||
      data.rideCost == "" ||
      data.capacity == ""
    ) {
      setErrorMsg("Please Enter All Fields");
      return;
    }

    console.log(data);

    return;

    try {
      const response = await fetch(NGROK_TUNNEL + "/listRide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const rdata = await response.json();
      console.log(rdata);

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
      <ScrollView
        contentContainerStyle={styles.textContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={[styles.text, { marginBottom: 25 }]}>List a new Trip</Text>
        {errorMsg ? (
          <Text style={[styles.text, { color: "red", marginTop: -5 }]}>
            {errorMsg}
          </Text>
        ) : null}
        <Text style={[styles.text, { marginBottom: 10 }]}>EndPoints</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Pressable
            style={[styles.locButton, { margin: 5, height: 50, flex: 1 }]}
          >
            <Text style={styles.buttontext} onPress={startLocOpenHandler}>
              Add Start Point
            </Text>
          </Pressable>
          <Text style={{ flex: 5, alignSelf: "center" }}>{startLocDesc}</Text>
          <SetLocation
            visible={isStartLocVisible}
            confirm={setStartLocation}
            closeModal={startLocCloseHandler}
          ></SetLocation>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Pressable
            style={[styles.locButton, { margin: 5, height: 50, flex: 1 }]}
          >
            <Text style={styles.buttontext} onPress={endLocOpenHandler}>
              Add End Point
            </Text>
          </Pressable>
          <Text style={{ flex: 5, alignSelf: "center" }}>{endLocDesc}</Text>
          <SetLocation
            visible={isEndLocVisible}
            confirm={setEndLocation}
            closeModal={endLocCloseHandler}
          ></SetLocation>
        </View>
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
  buttontext: {
    fontSize: 13,
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
  locButton: {
    backgroundColor: "#fff",
    color: "#000",
    padding: 5,
    borderRadius: 6,
    borderColor: "#000",
    borderWidth: 2,
    fontSize: 25,
    fontFamily: "Roboto",
    fontWeight: "bold",
    minWidth: 100,
    minHeight: 50,
    textAlign: "center",
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
});
