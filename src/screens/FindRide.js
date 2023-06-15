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
  LogBox
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import SetLocation from "../modals/SetLocation";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

// Common
import { submit } from "../common/button";
import { input } from "../common/input";

import { NGROK_TUNNEL, DISTANCE_MATRIX_KEY } from "@env";
import { AuthContext } from "../../server/context/authContext";

const FindRide = ({ navigation }) => {
  const context = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isStartLocVisible, setStartLocVisible] = useState(false);
  const [isEndLocVisible, setEndLocVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const [startLocDesc, setStartLocDesc] = useState("Not Selected");
  const [endLocDesc, setEndLocDesc] = useState("Not Selected");
  const [startTime, setStartTime] = useState(new Date());

  const [locData, setLocData] = useState(null);

  const [data, setData] = useState({
    startLocation: {
      description: "",
      latitude: "",
      longitude: "",
    },
    endLocation: { description: "", latitude: "", longitude: "" },
    startTime: "",
    startRadius: "",
    endRadius: "",
  });

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const { DateTime } = require('luxon');

  function startLocVisibleHandler() {
    setStartLocVisible(!isStartLocVisible);
  }

  function endLocVisibleHandler() {
    setEndLocVisible(!isEndLocVisible);
  }

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

  function datePickerVisibleHandler() {
    setTimePickerVisible(!isTimePickerVisible);
  }

  useEffect(() => {
    setData({ ...data, startTime: DateTime.fromISO(startTime.toISOString(), { zone: 'utc' }).setZone('America/Los_Angeles') });
  }, [startTime]);

  const onDateChange = (selectedDate) => {
    setTimePickerVisible(false);
    if (selectedDate) {
      setStartTime(selectedDate);
    }
  };

  function clearErrMsg() {
    setErrorMsg(null);
  }

  async function findRide() {
    if (
      data.startLocation.description == "" ||
      data.endLocation.description == "" ||
      data.startTime == ""
    ) {
      setErrorMsg("Please Enter All Fields");
      return;
    }

    try {
      console.log("Checking");
      console.log("log error")
      console.log("Checking");
      console.log("log log");
      console.log("log log");
      console.log("log log");
      const response = await fetch(NGROK_TUNNEL + "/findRide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response.ok);
      console.log('Debug');
      const rdata = await response.json();
      console.log('In Find Ride');
      console.log('Debug');
      if (response.ok) {
        console.log("Ride found Successfully");
        navigation.navigate("Rides", { rides: rdata, initialParams: {"startLocation":data.startLocation, "endLocation":data.endLocation,"startTime":data.startTime}});
      } else {
        alert("Could not find ride");
      }
    } catch (error) {
      console.log("Some error in finding the Ride " + error);
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
        <Text style={[styles.text, { marginBottom: 25, fontSize: 30 }]}>
          Enter Desired Ride
        </Text>
        {errorMsg ? (
          <Text style={[styles.text, { color: "red", marginTop: -5 }]}>
            {errorMsg}
          </Text>
        ) : null}
        <Text style={[styles.text, { marginBottom: 15 }]}>Trip Details</Text>

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
            <Text style={styles.buttontext} onPress={startLocVisibleHandler}>
              Add Start Point
            </Text>
          </Pressable>
          <Text style={{ flex: 5, alignSelf: "center" }}>{startLocDesc}</Text>
          <SetLocation
            visible={isStartLocVisible}
            confirm={setStartLocation}
            closeModal={startLocVisibleHandler}
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
            <Text style={styles.buttontext} onPress={endLocVisibleHandler}>
              Add End Point
            </Text>
          </Pressable>
          <Text style={{ flex: 5, alignSelf: "center" }}>{endLocDesc}</Text>
          <SetLocation
            visible={isEndLocVisible}
            confirm={setEndLocation}
            closeModal={endLocVisibleHandler}
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
            <Text style={styles.buttontext} onPress={datePickerVisibleHandler}>
              Start Time
            </Text>
          </Pressable>
          <Text style={{ flex: 5, alignSelf: "center" }}>
            {startTime.toLocaleString('en-US', options)}
          </Text>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="datetime"
            onConfirm={onDateChange}
            onCancel={datePickerVisibleHandler}
          />
        </View>
        <TextInput
          style={[input, { marginTop: 15 }]}
          placeholder="Ride Pickup Radius (in miles)"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, startRadius: text })}
          keyboardType="number-pad"
        />
        <TextInput
          style={input}
          placeholder="Ride Destination Radius (in miles)"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, endRadius: text })}
          keyboardType="number-pad"
        />

        <Pressable style={[submit, { marginTop: 15 }]}>
          <Text style={styles.text} onPress={findRide}>
            Find your Ride
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default FindRide;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    width: "60%",
    height: undefined,
    aspectRatio: 2.5
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