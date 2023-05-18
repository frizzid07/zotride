import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext } from "react";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

// Styles
import { submit } from "../common/button";
import { AuthContext } from "../../server/context/authContext";

const Driver = ({ navigation }) => {
  const context = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={styles.text}>Welcome {context.user.firstName}</Text>
        <Pressable
          style={[submit, { marginTop: 20 }]}
          onPress={() => navigation.navigate("ListRide")}>
          <Text style={styles.text}>Start a new trip</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Driver;

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
  innerContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-start",
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
