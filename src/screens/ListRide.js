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

import { NGROK_TUNNEL, DISTANCE_MATRIX_KEY } from "@env";
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

  const [locData, setLocData] = useState(null);

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

  const getInfo = async (data) => {
    try {
      const response = await fetch(`https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${data.startLocation.latitude},${data.startLocation.longitude}&destinations=${data.endLocation.latitude},${data.endLocation.longitude}&key=${DISTANCE_MATRIX_KEY}`, {
        method: "GET"
      });
      console.log(response.ok);
      console.log('Debug');
      if(response.ok) {
        const rdata = await response.json();
        console.log(rdata);
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
      setData({ ...data, startTime: new Date(selectedDate).toISOString() });
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
      console.log(`List Ride data ${JSON.stringify(data)}`);
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
        console.log('Debug');
        console.log('Debug');
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
        const response = await fetch(NGROK_TUNNEL + "/listRide", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: data }),
        });
        console.log(response.ok);
        console.log('Debug');
        console.log('Debug');
        const rdata = await response.json();
        console.log(rdata);
        console.log('In List Ride');

        if (rdata.added) {
          context.updateUser({ activeDriverRide: rdata.rideId});
          alert("Ride added successfully");
          console.log("Ride Added Successfully");
          navigation.pop();
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
        <Text style={[styles.text, { marginBottom: 15 }]}>List a new Trip</Text>
        {errorMsg ? (
          <Text style={[styles.text, { color: "red", marginTop: -2 }]}>
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
          style={[input, {marginTop: 10}]}
          placeholder="Ride Cost (USD) per Seat"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, rideCost: text })}
          keyboardType="number-pad"
          value={data.rideCost.toString()}
        />
        <TextInput
          style={[input, {marginTop: 5}]}
          placeholder="Number of Passengers"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, capacity: text })}
          keyboardType="number-pad"
          value={data.capacity.toString()}
        />
        <Pressable style={[submit, { marginTop: 15 }]}>
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
    width: "50%",
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