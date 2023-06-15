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
import { Ionicons } from "react-native-vector-icons";

// Styles
import { submit } from "../common/button";

import { AuthContext } from "../../server/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditProfile from "./EditProfile";

const ProfileLanding = ({ navigation }) => {
  const context = useContext(AuthContext);
  const [isDriver, setIsDriver] = useState(context.user.isDriver);

  useEffect(() => {
    console.log('Driver Status Initiated/Changed');
  }, [isDriver]);
  
  const editReg = async () => {
    console.log("We are checking")
    try {
      console.log('Debug');
      const response = await fetch(NGROK_TUNNEL + `/getDriver?driverId=${context.user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log(response.ok);
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      const rdata = await response.json();
      console.log(rdata);
      console.log('Debug');
      navigation.navigate('DriverRegistration', {driver: rdata.driver});
    } catch(error) {
      console.log("Could not edit record");
      alert(error)
    }
  }

  const deleteReg = async () => {
    try {
      console.log('Debug');
      const response = await fetch(NGROK_TUNNEL + `/deleteDriver?driverId=${context.user._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log(response.ok);
      console.log('Debug');
      console.log('Debug');
      console.log('Debug');
      if (response.ok) {
        console.log("Driver Deleted");
        context.updateUser({ isDriver: false});
        try {
          console.log('Debug');
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
          const rdata = await response2.json();
          console.log(rdata);
          console.log('Debug');
        } catch(error) {
          console.error(error);
        }
        alert("Driver Record Deleted");
      } else {
        console.log("Some error in registering");
        navigation.navigate("DriverRegistration");
      }
    } catch(error) {
      console.log("Could not delete record");
      alert(error)
    }
  }

  async function checkActiveRide() {
    console.log("Checking if Passenger has an Active ride");
    if(context.user.isDriver) {      
      setIsDriver(true);
    } else {
      setIsDriver(false);
    }
  }

  useEffect(() => {
    checkActiveRide();
  }, [context]);

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <Text style={[styles.text, {marginTop: 60}]}>User Profile</Text>
      <View style={styles.profileContainer}>
        <View style={styles.profileDetails}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileNameText}>
              {context.user.firstName + " " + context.user.lastName}
            </Text>
          </View>
          <Text style={[styles.profileText, {marginTop: '3%'}]}>
            <Text style={{fontWeight: 'bold'}}>Email<Text/>
            : </Text>{context.user.email}</Text>
          <Text style={styles.profileText}>
          <Text style={{fontWeight: 'bold'}}>Mobile<Text/>
            : </Text>{context.user.mobileNumber}</Text>
          <View style={styles.profileHeader}>
            <Pressable
              style={[
                submit,
                {
                  minWidth: 100,
                  minHeight: 30,
                  borderRadius: 3,
                  backgroundColor: "rgba(0, 74, 172, 0.8)",
                },
              ]}
              onPress={() => {
                navigation.navigate("EditProfile", { user: context.user });
              }}
            >
              <Text style={[styles.smallText, { color: "#fff" }]}>
                Edit Profile
              </Text>
            </Pressable>
            <Pressable
              style={[
                submit,
                {
                  minWidth: 100,
                  minHeight: 30,
                  borderRadius: 3,
                  backgroundColor: "rgba(235, 210, 95, 0.8)",
                },
              ]}
              onPress={context.logout}
            >
              <Text style={[styles.smallText, { color: "#000" }]}>
                Logout
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Pressable
          style={[submit, { minWidth: 150, minHeight: 30, borderRadius: 3, marginTop: '10%' }]}
          onPress={() => {
            navigation.navigate("PastRides");
          }}
        >
          <Text style={styles.text}>View your Rides</Text>
        </Pressable>

        {isDriver && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 25, color: "#000", marginTop: '5%', marginBottom: '2%' }}>
              Modify your Driver Details
            </Text>
            <Pressable
              style={[submit, { minWidth: 150, minHeight: 30, borderRadius: 3, backgroundColor: 'rgba(0, 74, 172, 0.8)' }]}
              onPress={editReg}
            >
              <Text style={[styles.text, { color: 'white', fontSize: 20}]}>Edit Registration</Text>
            </Pressable>
            <Pressable
              style={[submit, { minWidth: 150, minHeight: 30, borderRadius: 3, backgroundColor: "rgba(194, 24, 7, 0.8)" }]}
              onPress={deleteReg}
            >
              <Text style={[styles.text, { color: 'white', fontSize: 20}]}>Delete Registration</Text>
            </Pressable>
        </View>
        )}

        {!isDriver && (
          <View>
            <Text style={{ fontSize: 25, color: "#000", marginTop: '5%' }}>
              Enroll as a Driver with us
            </Text>
            <Pressable
              style={submit}
              onPress={() => {
                navigation.navigate("DriverRegistration");
              }}
            >
              <Text style={styles.text}>Register</Text>
            </Pressable>
          </View>
        )}

      </View>
    </View>
  );
};

export default ProfileLanding;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  textContainer: {
    display: "flex",
    height: "100%",
    alignItems: "center",
  },
  bg: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    backgroundColor: "white",
    padding: 15,
    marginTop: 20,
    maxWidth: "90%",
    justifyContent: "center",
  },
  smallText: {
    fontSize: 15,
  },
  text: {
    fontSize: 25,
    color: "#000",
  },
  logo: {
    width: "60%",
    height: undefined,
    aspectRatio: 2.5
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "black",
    marginRight: 15,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    resizeMode: "cover",
  },
  profileDetails: {
    flex: 1,
    alignItems: "center",
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  profileText: {
    fontSize: 15,
    marginBottom: 1,
  },
  profileNameText: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 1,
  },
  editButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
});
