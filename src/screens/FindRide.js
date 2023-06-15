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

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  const getInfo = async (data) => {
    try {
      const response = await fetch(`https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${data.startLocation.latitude},${data.startLocation.longitude}&destinations=${data.endLocation.latitude},${data.endLocation.longitude}&key=${DISTANCE_MATRIX_KEY}`, {
        method: "GET"
      });
      console.log(response.ok);
      console.log('Debug');
      console.log('Debug');
      if(response.ok) {
        const rdata = await response.json();
        console.log(rdata);
        console.log('Debug');
        console.log('Debug');
        setLocData(rdata);
      }
    } catch(error) {
      console.log(error);
    }
  }

  function metersToMiles(meters) {
    const miles = meters * 0.000621371;
    return miles.toFixed(1);
  }

  function calcFare(total) {
    const rate = 2;
    const extra = 10;
    const fix = 5;
    const above = 25;
    const next = 25;
    const min = 1;
    const cons = 1.5;

    total = total / 1000;
    if (10>total){
    var cost = fix;
    }
    else if (10<total && 20>total)
      {
      var cost = (total * rate) + extra;
      }
      else if (20<total && 30>total)
      {
          var cost = (total * rate) + next;
      }
      else if (30<total && 50>total)
      {
          var cost = ((total - 30) * cons) + above;
      }
      else
      {
          var cost = ((total - 50) * min) + 50;
      }

    var fare = cost * 0.11 + cost;
    return fare.toFixed(2);
  }

  useEffect(() => {
    if (data.startLocation.description && data.endLocation.description) {
      console.log('Start and end locations are populated');
      getInfo(data);
    }
  }, [data.startLocation.description, data.endLocation.description]);

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
      data.startTime == "" ||
      data.startRadius == "" ||
      data.endRadius == ""
    ) {
      setErrorMsg("Please Enter All Fields");
      return;
    }

    try {
      console.log("Checking");
      const response = await fetch(NGROK_TUNNEL + "/findRide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response.ok);
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      const rdata = await response.json();
      console.log('In Find Ride');
      console.log('Debug');
      console.log('Debug');
      if (response.ok) {
        console.log("Ride found Successfully");
        navigation.navigate("Rides", { rides: rdata });
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
        {locData !== null && 
          <View>
            <Text style={[styles.text, { marginTop: 15, textAlign: "center"}]}>Trip Stats</Text>
            <Text style={[styles.buttontext, {fontSize: 20, marginTop: 10}]}>
            Journey: {metersToMiles(locData.rows[0].elements[0].distance.value)} miles{"\n"}
            Duration: {locData.rows[0].elements[0].duration.text}{"\n"}
            Estimated Cab Fare: ${calcFare(locData.rows[0].elements[0].distance.value)}
            </Text>
          </View>
        }
        <Text style={[styles.text, { marginTop: 15 }]}>Other Details</Text>
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
    paddingBottom: 50
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