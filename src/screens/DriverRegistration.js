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

const DriverRegistration = ({ navigation }) => {
  const context = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState(null);

  function clearErrMsg() {
    setErrorMsg(null);
  }

  const [data, setData] = useState({
    userId: context.user._id,
    licenseNumber: "",
    vehicleInformation: {
      vehicleNumber: "",
      vehicleCompany: "",
      vehicleModel: "",
      vehicleColor: "",
      vehicleCapacity: "",
    },
  });

  async function registerDriver() {
    if (
      data.licenseNumber == "" ||
      data.vehicleInformation.vehicleNumber == "" ||
      data.vehicleInformation.vehicleCompany == "" ||
      data.vehicleInformation.vehicleModel == "" ||
      data.vehicleInformation.vehicleColor == "" ||
      data.vehicleInformation.vehicleCapacity == ""
    ) {
      setErrorMsg("Please Enter all Fields");
      return;
    }

    console.log(data);

    // Further logic to call the api and save driver details
    //Let's assume we have successfully saved the driver details

    try {
      const response = await fetch(NGROK_TUNNEL + "/driverRegistration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({data: data})
      });
      const rdata = await response.json();
      console.log(rdata);
      if (rdata.success) {
        console.log("Driver Registered Successfully");
        try {
          const response2 = await fetch(NGROK_TUNNEL + "/driverRegistration", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({data: data})
          });
          const rdata2 = await response2.json();
          console.log(rdata2);
        } catch(error) {
          console.error(error);
        }
        navigation.navigate("Driver");
      } else {
        console.log("Some error in registering");
        navigation.navigate("DriverRegistration");
      }
    } catch (error) {
      console.log("Some error in registering as Driver " + error);
    } finally {}
  }

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <ScrollView contentContainerStyle={styles.textContainer}>
        <TouchableOpacity>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={[styles.text, { marginBottom: 25 }]}>
          Register as a Driver with us
        </Text>
        {errorMsg ? (
          <Text style={[styles.text, { color: "red", marginTop: -5 }]}>
            {errorMsg}
          </Text>
        ) : null}
        <Text style={styles.text}>License Number</Text>
        <TextInput
          style={input}
          placeholder="License Number"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, licenseNumber: text })}
        />
        <Text style={styles.text}>Vehicle Number</Text>
        <TextInput
          style={input}
          placeholder="Vehicle Number"
          onPressIn={clearErrMsg}
          onChangeText={(text) =>
            setData({
              ...data,
              vehicleInformation: {
                ...data.vehicleInformation,
                vehicleNumber: text,
              },
            })
          }
        />

        <Text style={styles.text}>Car Details</Text>
        <TextInput
          style={input}
          placeholder="Company"
          onPressIn={clearErrMsg}
          onChangeText={(text) =>
            setData({
              ...data,
              vehicleInformation: {
                ...data.vehicleInformation,
                vehicleCompany: text,
              },
            })
          }
        />
        <TextInput
          style={input}
          placeholder="Model"
          onPressIn={clearErrMsg}
          onChangeText={(text) =>
            setData({
              ...data,
              vehicleInformation: {
                ...data.vehicleInformation,
                vehicleModel: text,
              },
            })
          }
        />
        <TextInput
          style={input}
          placeholder="Color"
          onPressIn={clearErrMsg}
          onChangeText={(text) =>
            setData({
              ...data,
              vehicleInformation: {
                ...data.vehicleInformation,
                vehicleColor: text,
              },
            })
          }
        />
        <TextInput
          style={input}
          placeholder="Capacity"
          onPressIn={clearErrMsg}
          onChangeText={(text) =>
            setData({
              ...data,
              vehicleInformation: {
                ...data.vehicleInformation,
                vehicleCapacity: text,
              },
            })
          }
          keyboardType="number-pad"
        />
        <Pressable style={[submit, { marginTop: -5 }]}>
          <Text style={styles.text} onPress={registerDriver}>
            Register
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default DriverRegistration;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%"
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
