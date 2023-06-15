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

const Register = ({ navigation }) => {
  const [confirm, setConfirm] = useState();
  const [fdata, setFdata] = useState({
    firstName: "",
    lastName: "",
    dayOfBirth: "",
    monthOfBirth: "",
    yearOfBirth: "",
    mobileNumber: "",
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState(null);

  async function Sendtobackend() {
    if (
      fdata.firstName == "" ||
      fdata.lastName == "" ||
      fdata.dayOfBirth == "" ||
      fdata.monthOfBirth == "" ||
      fdata.yearOfBirth == "" ||
      fdata.mobileNumber == "" ||
      fdata.email == "" ||
      fdata.password == "" ||
      confirm == ""
    ) {
      setErrorMsg("All fields are required");
      return;
    } else {
      if (fdata.password != confirm) {
        setErrorMsg("Password and Confirm Password must be same");
        return;
      } else {
        console.log("Fetching Verify API");
        console.log("Please bro");
        try {
          console.log('Debug');
          const response = await fetch(NGROK_TUNNEL + "/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(fdata),
          });
          console.log(response.ok);
          console.log('Debug');
          console.log('Debug');
          console.log('Debug');
          console.log('Debug');
          const data = await response.json();
          console.log('In Register');
          console.log(data);
          console.log('Debug');

          if (data.error === "Invalid Credentials") {
            alert("Invalid Credentials");
            setErrorMsg("Invalid Credentials");
            navigation.navigate("Register");
          } else if (data.message === "Verification Code Sent to your Email") {
            alert(data.message);
            navigation.navigate("Verify", { userdata: data.udata });
          } else {
            alert(data.error);
            setErrorMsg(data.error);
          }
        } catch (error) {
          // Handle any errors that occur
          alert(error.message);
          console.error("Error:", error);
        } finally {
          // Always make sure to unset the error message
        }
      }
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <ScrollView contentContainerStyle={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={[styles.text, { marginBottom: 25 }]}>
          Register your Account
        </Text>
        {errorMsg ? (
          <Text style={[styles.text, { color: "red", marginTop: -5 }]}>
            {errorMsg}
          </Text>
        ) : null}
        <Text style={[styles.text, { fontSize: 15, marginBottom: -5 }]}>
          Name
        </Text>
        <View style={styles.innerContainer}>
          <TextInput
            style={[input, { flex: 1, minWidth: 100 }]}
            placeholder="First Name"
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, firstName: text })}
          />
          <TextInput
            style={[input, { flex: 1, minWidth: 100 }]}
            placeholder="Last Name"
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, lastName: text })}
          />
        </View>
        <Text style={[styles.text, { fontSize: 15, marginBottom: -5 }]}>
          Date of Birth
        </Text>
        <View style={styles.innerContainer}>
          <TextInput
            style={[input, { flex: 2, minWidth: 50 }]}
            placeholder="Month"
            keyboardType="number-pad"
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, monthOfBirth: text })}
          />
          <TextInput
            style={[input, { flex: 2, minWidth: 50 }]}
            placeholder="Day"
            keyboardType="number-pad"
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, dayOfBirth: text })}
          />
          <TextInput
            style={[input, { flex: 3, minWidth: 100 }]}
            placeholder="Year"
            keyboardType="number-pad"
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, yearOfBirth: text })}
          />
        </View>
        <TextInput
          style={input}
          placeholder="Mobile Number"
          keyboardType="number-pad"
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setFdata({ ...fdata, mobileNumber: text })}
        />
        <TextInput
          style={[input, { textTransform: "lowercase" }]}
          placeholder="Email Address"
          keyboardType="email-address"
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setFdata({ ...fdata, email: text })}
        />
        <TextInput
          style={input}
          placeholder="Password"
          secureTextEntry={true}
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setFdata({ ...fdata, password: text })}
        />
        <TextInput
          style={input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setConfirm(text)}
        />
        <Text
          style={{
            fontSize: 15,
            color: "#000",
            marginTop: 5,
            marginBottom: 10,
          }}
        >
          Already have an account?&nbsp;
          <Text
            style={{ color: "#004aad" }}
            onPress={() => navigation.navigate("Login")}
          >
            Login instead!
          </Text>
        </Text>
        <Pressable style={[submit, { marginTop: -5 }]} onPress={Sendtobackend}>
          <Text style={styles.text}>Register</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default Register;

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
    width: "50%",
    height: undefined,
    aspectRatio: 2.5
  },
});
