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
    TouchableOpacity
  } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

// Common
import { submit } from "../common/button";
import { input } from "../common/input";

import { NGROK_TUNNEL } from "@env";
import { AuthContext } from "../../server/context/authContext";

const FindRide = ({ navigation }) => {
    const [errorMsg, setErrorMsg] = useState(null);
    const [dateTime, setDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [data, setData] = useState({
        startLocation: "",
        endLocation: "",
        startTime: ""
      });

    useEffect(() => {
        setData({ ...data, startTime: dateTime.toISOString().slice(0, -1)})
    }, [dateTime]);
    
    const onDateChange = (selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
          setDateTime(selectedDate);
        }
      };

    const openDatePicker = () => {
        setShowDatePicker(true);
      };

      function clearErrMsg() {
        setErrorMsg(null);
      }

      async function findRide() {
        if (
          data.startLocation == "" ||
          data.endLocation == "" ||
          data.startTime == ""
        ) {
          setErrorMsg("Please Enter All Fields");
          return;
        }
    
        try {
            console.log(data);
          const response = await fetch(NGROK_TUNNEL + "/findRide", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          console.log(response.ok)
    
          const rdata = await response.json();
          console.log(rdata);
    
          if (response.ok) {
            console.log("Ride found Successfully");
            navigation.navigate("Rides", {rides: rdata});
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
            <ScrollView contentContainerStyle={styles.textContainer}>
                <TouchableOpacity>
                <Image style={styles.logo} source={logo} />
                </TouchableOpacity>
                <Text style={[styles.text, { marginBottom: 25 }]}>Desired Ride</Text>
                {errorMsg ? (
                <Text style={[styles.text, { color: "red", marginTop: -5 }]}>
                    {errorMsg}
                </Text>
                ) : null}
                <Text style={styles.text}>Trip Details</Text>
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
                <Button title="Open DatePicker" onPress={openDatePicker} />
                <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="datetime"
                    onConfirm={onDateChange}
                    onCancel={() => setShowDatePicker(false)}
                />
                <Text style={styles.text}>{dateTime.toISOString().slice(0, -1)}</Text>
                <Pressable style={[submit, { marginTop: -5 }]}>
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
      height: "100%"
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