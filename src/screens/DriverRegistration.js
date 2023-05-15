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
import React, { useState } from "react";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

// Common
import { submit } from "../common/button";
import { input } from "../common/input";

import { NGROK_TUNNEL } from "@env";

const DriverRegistration = ({ navigation }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [userData, setUserData] = useState(getUserData());
  //This function will be used to fetch the user's id
  function getUserData() {
    return { id: "test" };
  }

  function clearErrMsg() {
    setErrorMsg(null);
  }

  const [data, setData] = useState({
    userId: "",
    licenseNumber: "",
    vehicleNumber: "",
    vehicleCompany: "",
    vehicleModel: "",
    vehicleColor: "",
  });

  function registerDriver() {
    if (
      data.licenseNumber == "" ||
      data.vehicleNumber == "" ||
      data.vehicleCompany == "" ||
      data.vehicleModel == "" ||
      data.vehicleColor == ""
    ) {
      setErrorMsg("Please Enter all Fields");
      return;
    }

    // Adding the obtained UserId
    setData({ ...data, userId: userData.id });

    console.log(data);

    // Further logic to call the api and save driver details
    //Let's assume we have successfully saved the driver details

    navigation.navigate("Driver");
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
          onChangeText={(text) => setData({ ...data, vehicleNumber: text })}
        />

        <Text style={styles.text}>Car Details</Text>
        <TextInput
          style={input}
          placeholder="Company"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, vehicleCompany: text })}
        />
        <TextInput
          style={input}
          placeholder="Model"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, vehicleModel: text })}
        />
        <TextInput
          style={input}
          placeholder="Color"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, vehicleColor: text })}
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
