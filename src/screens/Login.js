import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Button,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

// Common
import { submit } from "../common/button";
import { input } from "../common/input";

import { AuthContext } from "../../server/context/authContext";
import { NGROK_TUNNEL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useAsyncStorage } from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const context = useContext(AuthContext);
  const [isChecking, setIsChecking] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [user, setUser] = useState();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsChecking(true);
        let userVal = await AsyncStorage.getItem("user");
        if (userVal) {
          userVal = JSON.parse(userVal);
          console.log(userVal);
          setUser(userVal);
          setData((data) => ({ ...data, username: userVal.email }));
          setData((data) => ({ ...data, password: userVal.password }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsChecking(false);
      }
    };
    checkUser();
  }, [context]);

  async function loginUser() {
    try {
      setIsChecking(true);
      console.log(`In Login ${data}, ${JSON.stringify(data)}`);
      const response = await fetch(NGROK_TUNNEL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({data: data})
      });
      const rdata = await response.json();
      console.log(rdata);
      console.log('Dodging error');
      if (response.ok) {
        console.log(`Token in Login ${JSON.stringify(rdata)}`);
        let authenticated = await context.authenticate(rdata);
        console.log(authenticated);
        if (authenticated) {
          setIsSuccessful(true);
          alert(`Logged in successfully`);
        }
      } else {
        setErrorMsg(rdata.error);
        alert("Login failed");
      }
    } catch (error) {
      setIsSuccessful(false);
      setErrorMsg(error);
      console.error(error);
      alert(error);
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, color: "#000", marginBottom: 20 }}>
          Login to your Account
        </Text>
        {errorMsg ? (
          <Text style={[styles.text, { color: "red", marginTop: -5 }]}>
            {errorMsg}
          </Text>
        ) : null}
        <TextInput
          style={[input, { textTransform: "lowercase" }]}
          placeholder="Email or Mobile Number"
          keyboardType="email-address"
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setData({ ...data, username: text })}
          value={data.username}
        />
        <TextInput
          style={input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => setData({ ...data, password: text })}
          onPressIn={() => setErrorMsg(null)}
          value={data.password}
        />
        <Text
          style={{
            fontSize: 15,
            color: "#000",
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          Don't have an account?&nbsp;
          <Text
            style={{ color: "#004aad" }}
            onPress={() => navigation.navigate("Register")}
          >
            Register Now!
          </Text>
        </Text>
        <Pressable style={submit} onPress={loginUser}>
          <Text style={styles.text}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({

    container: {
        width: '100%',
        height: '100%'
    },
    textContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    bg: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
    },
    text: {
        fontSize: 25,
        color: '#000'
    },
    logo: {
        width: '40%',
        height: undefined,
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: '#ffde59',
        borderRadius: 5,
        marginBottom: 40
    }
});
