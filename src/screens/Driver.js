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
      console.log("We are checking")
      try {
        const response = await fetch(NGROK_TUNNEL + `/findActiveRide?driverId=${context.user._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        const result = await response.json();
        console.log(result);
        console.log('In Active Ride');

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
    checkActiveRide();
  }, []);

  async function editRide() {
    try {
      const response = await fetch(NGROK_TUNNEL + `/findActiveRide?driverId=${context.user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const result = await response.json();
      console.log(result);

      if (result.ride) {
        console.log(`New Data ${JSON.stringify(result.ride)}`);
        navigation.navigate('ListRide', {ride: result.ride});
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function cancelRide() {
    try {
      const response = await fetch(NGROK_TUNNEL + `/deleteRide?rideId=${activeRide._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const result = await response.json();
      console.log(result)

      if (result.deleted) {
        console.log("Ride Deleted");
        setHasActive(false);
      } else {
        console.log(`Could not Delete due to ${result.error}`);
      }
    } catch (err) {
      console.log("Error in deleting " + err);
    }
  }

  const editReg = async () => {
    console.log("We are checking")
    try {
      const response = await fetch(NGROK_TUNNEL + `/getDriver?driverId=${context.user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const rdata = await response.json();
      console.log(rdata);
      console.log(response.ok);
      console.log(`New Data ${JSON.stringify(rdata.driver)}`);
      navigation.navigate('DriverRegistration', {driver: rdata.driver});
    } catch(error) {
      console.log("Could not edit record");
      alert(error)
    }
  }

  const deleteReg = async () => {
    try {
      const response = await fetch(NGROK_TUNNEL + `/deleteDriver?driverId=${context.user._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log(response.ok);
      if (response.ok) {
        console.log("Driver Deleted");
        try {
          context.user.isDriver = false;
          const response2 = await fetch(NGROK_TUNNEL + "/driverRegistration", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({data: {userId: context.user._id}})
          });
          const rdata = await response2.json();
          console.log(rdata);
          console.log(response2.ok);
          console.log('In Driver Registration again');
        } catch(error) {
          console.error(error);
        }
        alert("Driver Record Deleted");
        navigation.navigate("Landing");
      } else {
        console.log("Some error in registering");
        navigation.navigate("DriverRegistration");
      }
    } catch(error) {
      console.log("Could not delete record");
      alert(error)
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
          <Image style={[styles.logo, {width: "25%"}]} source={logo} />
        </TouchableOpacity>
        <Text style={styles.text}>Welcome, {context.user.firstName}</Text>
        {!hasActive && (
          <View style={{ width: "75%", marginTop: 25 }}>
            <Pressable
              style={submit}
              onPress={() => navigation.navigate("ListRide")}
            >
              <Text style={styles.text}>Start a New Trip</Text>
            </Pressable>
          </View>
        )}
        {hasActive && (
          <View style={{ width: "100%", marginTop: 15 }}>
            <Text style={styles.text}>Your Current Ride</Text>
            <SingleRide ride={activeRide}></SingleRide>
            <View style={{ width: "60%", marginTop: 15, alignSelf: 'center' }}>
              <Pressable style={[submit, { backgroundColor: '#004aac' }]} onPress={editRide}>
                <Text style={[styles.text, { color: 'white', fontSize: 20 }]}>Modify Trip</Text>
              </Pressable>
              <Pressable style={[submit, { backgroundColor: "#ebd25f", marginTop: -5 }]} onPress={cancelRide}>
                <Text style={[styles.text, { color: 'black', fontSize: 20 }]}>Cancel Trip</Text>
              </Pressable>
            </View>
          </View>
        )}
        <View style={{ width: "60%", marginTop: 15 }}>
          <Pressable
            style={[submit, { backgroundColor: '#004aac' }]}
            onPress={editReg}
          >
            <Text style={[styles.text, { color: 'white', fontSize: 20 }]}>Edit Registration</Text>
          </Pressable>
          <Pressable
            style={[submit, { backgroundColor: "#ebd25f", marginTop: -5 }]}
            onPress={deleteReg}
          >
            <Text style={[styles.text, { color: 'black', fontSize: 20 }]}>Delete Registration</Text>
          </Pressable>
        </View>
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
    marginBottom: 20,
  },
});