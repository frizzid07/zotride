import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";

import SingleRide from "../common/SingleRide";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

// Styles
import { submit } from "../common/button";
import { AuthContext } from "../../server/context/authContext";
import { NGROK_TUNNEL } from "@env";

const Driver = ({ navigation }) => {
  const context = useContext(AuthContext);
  const [hasActive, setHasActive] = useState(false);
  const [activeRide, setActiveRide] = useState({});

  useEffect(() => {
    async function checkActiveRide() {
      console.log("Checking if Driver has an Active ride");
      console.log(context.user._id);
      try {
        const response = await fetch(NGROK_TUNNEL + "/findActiveRide", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: { driverId: context.user._id } }),
        });

        const result = await response.json();
        console.log(result);

        if (result.ride) {
          console.log("Current Driver has Active Ride");
          setActiveRide(result.ride);
          setHasActive(true);
        } else {
          console.log("Current Driver has no Active Ride");
          setHasActive(false);
        }
      } catch (err) {
        console.log("Some backend error");
        console.log(err);
      }
    }
    console.log("Checking");
    checkActiveRide();
  }, []);

  async function cancelRide() {
    const id = activeRide._id;
    console.log(id);
    try {
      const response = await fetch(NGROK_TUNNEL + "/deleteRide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { id: id } }),
      });

      const result = await response.json();

      if (result.deleted) {
        console.log("Ride Deleted");
        setHasActive(false);
      } else {
        console.log("Could not Delete");
      }
    } catch (err) {
      console.log("Error in deleting " + err);
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={styles.text}>Welcome, {context.user.firstName}</Text>
        {!hasActive && (
          <Pressable
            style={[submit, { marginTop: 20 }]}
            onPress={() => navigation.navigate("ListRide")}
          >
            <Text style={styles.text}>Start a new trip</Text>
          </Pressable>
        )}
        {hasActive && (
          <View style={{ width: "100%", marginTop: 50 }}>
            <Text>Your Currrent Ride</Text>
            <SingleRide ride={activeRide}></SingleRide>
            <Pressable style={[submit, { marginTop: 20 }]} onPress={cancelRide}>
              <Text style={styles.text}>Cancel Trip</Text>
            </Pressable>
          </View>
        )}
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
