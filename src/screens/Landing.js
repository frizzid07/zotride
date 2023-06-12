import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { NGROK_TUNNEL } from "@env";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

// Styles
import { submit } from "../common/button";

import { AuthContext } from "../../server/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Landing = ({ navigation }) => {
  const context = useContext(AuthContext);
  const [name, setName] = useState();

  useEffect(() => {
    const getUser = async () => {
      let userVal = await AsyncStorage.getItem("user");
      if (userVal) {
        userVal = JSON.parse(userVal);
        setName(userVal.firstName);
      }
    };
    getUser();
  }, []);

  const isRegisteredDriver = async () => {
    console.log('Checking Driver');
    try {
      const response = await fetch(
        NGROK_TUNNEL + `/getDriver?driverId=${context.user._id}`,
        {
          method: "GET",
        }
      );
      console.log(response.ok);
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      const rdata = await response.json()
      console.log(rdata);
      console.log('Debug');
      console.log('Debug');
      console.log('In Landing');
      console.log('Debug');
      if(rdata.driver !== null) {
        console.log('Driver Record found');
        return true;
      } else {
        try {
          const response2 = await fetch(NGROK_TUNNEL + "/driverRegistration", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({data: {userId: context.user._id}})
          });
          console.log(response2.ok);
          console.log('Debug');
          console.log('Debug');
          console.log('Debug');
          console.log('Debug');
          const rdata2 = await response2.json();
          console.log(rdata2);
          console.log('Debug');
          console.log('Debug');
          console.log('Debug');
        } catch(error) {
          console.error(error);
        }
      }
    } catch(error) {
      console.log(error);
    }
    return false;
  }
  
  const driverRole = async () => {
    //Checking if The User is a registered Driver
    console.log("Drive Role Function Called");
    if (context.user.isDriver) {
      console.log('Debug');
      const checkDriver = await isRegisteredDriver();
      console.log(checkDriver);
      if(checkDriver)
        navigation.navigate("Driver");
      else
        navigation.navigate("DriverRegistration");
    } else {
      navigation.navigate("DriverRegistration");
    }
  };
  
  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Landing")}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, color: "#000", marginBottom: 20 }}>
          Welcome to ZotRide, {name}
        </Text>
        <Text style={{ fontSize: 25, color: "#000", marginBottom: 20 }}>
          Choose a Role
        </Text>
        <Pressable style={submit} onPress={driverRole}>
          <Text style={styles.text}>Driver</Text>
        </Pressable>
        <Pressable style={submit} onPress={() => {navigation.navigate("Passenger")}}>
          <Text style={styles.text}>Passenger</Text>
        </Pressable>
        <Pressable
          style={[submit, { minWidth: 100, minHeight: 30, borderRadius: 3 }]}
          onPress={context.logout}
        >
          <Text style={styles.text}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
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
    width: "40%",
    height: undefined,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: "#ffde59",
    borderRadius: 5,
    marginBottom: 40,
  },
});