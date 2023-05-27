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
import React, { useState, useContext, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

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
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const [startLocDesc, setStartLocDesc] = useState("Not Selected");
  const [endLocDesc, setEndLocDesc] = useState("Not Selected");
  const [startTime, setStartTime] = useState(new Date());

  function startLocVisibleHandler() {
    setStartLocVisible(!isStartLocVisible);
  }

  function endLocVisibleHandler() {
    setEndLocVisible(!isEndLocVisible);
  }

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const { DateTime } = require('luxon');

  const [data, setData] = useState({
    rideId: "test",
    driverId: context.user._id,
    passengers: [],
    isActive: true,
    startLocation: {
      description: "",
      latitude: "",
      longitude: "",
    },
    endLocation: { description: "", latitude: "", longitude: "" },
    startTime: "",
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

    try {
      console.log(data);
      const response = await fetch(NGROK_TUNNEL + "/listRide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data }),
      });
      console.log(response.ok);

      const rdata = await response.json();
      console.log(rdata);

      if (rdata.added) {
        alert("Ride added successfully");
        console.log("Ride Added Successfully");
        navigation.navigate("Landing");
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
        <Text style={[styles.text, { marginTop: 15 }]}>Other Details</Text>
        <TextInput
          style={input}
          placeholder="Ride Cost (USD)"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, rideCost: text })}
          keyboardType="number-pad"
        />
        <TextInput
          style={input}
          placeholder="Number of Passengers"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, capacity: text })}
          keyboardType="number-pad"
        />
        <Pressable style={[submit, { marginTop: 50 }]}>
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
