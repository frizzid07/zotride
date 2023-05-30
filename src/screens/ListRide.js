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

const ListRide = ({ navigation, route }) => {
  const context = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState(null);
  const { DateTime } = require('luxon');

  const [isStartLocVisible, setStartLocVisible] = useState(false);
  const [isEndLocVisible, setEndLocVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const [startLocDesc, setStartLocDesc] = useState("Not Selected");
  const [endLocDesc, setEndLocDesc] = useState("Not Selected");
  const [startTime, setStartTime] = useState(new Date());

  const [fillData, setFillData] = useState(route?.params?.ride);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

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

  function fetchDesc(fillData) {
    setStartLocDesc(fillData.startLocation.description);
    setEndLocDesc(fillData.endLocation.description);
    setStartTime(new Date(fillData.startTime).toLocaleString('en-US', options));
  }

  useEffect(() => {
    console.log(`Filldata value ${fillData} ${JSON.stringify(fillData)}`);

    if(fillData !== undefined) {
      setData((data) => ({
        ...data,
        rideCost: fillData.rideCost,
        capacity: fillData.capacity,
        startTime: fillData.startTime,
        startLocation: {
          ...data.startLocation,
          description: fillData.startLocation.description,
          latitude: fillData.startLocation.latitude,
          longitude: fillData.startLocation.longitude
        },
        endLocation: {
          ...data.endLocation,
          description: fillData.endLocation.description,
          latitude: fillData.endLocation.latitude,
          longitude: fillData.endLocation.longitude
        }
      }));
      fetchDesc(fillData);
    }
  }, []);

  const checkEditedData = (editData) => {
    if(data.startTime != fillData.startTime)
      editData.startTime = data.startTime;
    if(data.rideCost != fillData.rideCost)
      editData.rideCost = data.rideCost;
    if(data.capacity != fillData.capacity)
      editData.capacity = data.capacity;
    if(data.startLocation.description != fillData.startLocation.description) {
      editData.startLocation = {};
      if(data.startLocation.description != fillData.startLocation.description) {
        editData.startLocation.description = data.startLocation.description;
        editData.startLocation.latitude = data.startLocation.latitude;
        editData.startLocation.longitude = data.startLocation.longitude;
      }
    }
    if(data.endLocation.description != fillData.endLocation.description) {
      editData.endLocation = {};
      if(data.endLocation.description != fillData.endLocation.description) {
        editData.endLocation.description = data.endLocation.description;
        editData.endLocation.latitude = data.endLocation.latitude;
        editData.endLocation.longitude = data.endLocation.longitude;
      }
    }
    return editData;
  }
  
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

  const onDateChange = (selectedDate) => {
    setTimePickerVisible(false);
    console.log(`Selected Date ${selectedDate} ${typeof selectedDate}`);
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

    if(fillData !== undefined) {
      const editData = await checkEditedData({});
      console.log(`New Edit Data ${editData} ${JSON.stringify(editData)}`);

      if(Object.keys(editData).length === 0) {
        setErrorMsg("No Changes Made");
        alert("No edits made");
        return;
      }

      try {
        const response = await fetch(NGROK_TUNNEL + `/editRide?driverId=${context.user._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({editData: editData}),
        });
        console.log(response.ok);
        if (response.ok) {
          console.log("Ride Updated");
          alert("Trip Updated");
          navigation.navigate("Driver");
        }
      } catch(error) {
        console.log("Could not update trip");
        alert(error);
      }
    }
    
    else {
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
        console.log('In List Ride');

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
          value={data.rideCost.toString()}
        />
        <TextInput
          style={input}
          placeholder="Number of Passengers"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, capacity: text })}
          keyboardType="number-pad"
          value={data.capacity.toString()}
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
    width: "15%",
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