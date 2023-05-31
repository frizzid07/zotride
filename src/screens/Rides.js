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
import React, { useState, useContext, useEffect } from "react";

// Images
import background from "../../assets/background.jpg";

// Common
import { submit } from "../common/button";

import { NGROK_TUNNEL } from "@env";

import { AuthContext } from "../../server/context/authContext";

const Rides = ({ navigation, route }) => {
  const context = useContext(AuthContext);
  const [rides, setRides] = useState(route.params.rides);
  const [drivers, setDrivers] = useState([]);

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  
  const fetchDrivers = async () => {
    const driverData = [];

    for (const ride of rides) {
      try {
        const response = await fetch(
          NGROK_TUNNEL + `/getDriver?driverId=${ride.driverId}`,
          {
            method: "GET",
          }
        );
        console.log(response.ok);
        if (response.ok) {
          const driver = await response.json();
          console.log(driver);
          driverData.push(driver);
        } else {
          console.error("Failed to fetch driver data");
        }
      } catch (error) {
        console.error(error);
      }
    }

    setDrivers(driverData);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  async function bookRide(ride) {
    const data = {
      "rideId": ride._id,
      "userId": context.user._id
    }
    try {
      const response = await fetch(NGROK_TUNNEL + "/bookRide", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response.ok);
      const rdata = await response.json();
      console.log(rdata);
      console.log('In Book Ride');
      console.log('One more');
      console.log('Why are we here? Just to suffer?');
      if(response.ok) {
        alert(rdata.success);
        navigation.navigate("Confirm", { ride: ride });
      } else {
        alert(rdata.error);
        console.log("Error while booking ride")
      }
    } catch (error) {
      alert(error);
      console.log("Error while booking ride "+error)
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background} />
      <Text style={[styles.text, { marginBottom: 5, marginTop: 50 }]}>
        Available Rides
      </Text>
      {rides.length === 0 ? (
        <Text
          style={[styles.text, { fontSize: 25, margin: 20, color: "gray" }]}
        >
          No available rides
        </Text>
      ) : (
        rides.map((ride, index) => {
          const driver = drivers[index];
          return (
            <View key={index} style={styles.rideBox}>
              <View style={styles.rideContainer}>
                <Text style={[styles.location, {textAlign: 'left'}]}>
                  <Text style={{ fontWeight: "bold" }}>
                    {ride.startLocation.description}
                  </Text>
                </Text>
                <Text style={styles.text}> to </Text>
                <Text style={[styles.location, {textAlign: 'right'}]}>
                  <Text style={{ fontWeight: "bold"}}>
                    {" "}
                    {ride.endLocation.description}
                  </Text>
                </Text>
              </View>
              <View style={styles.rideContainer}>
                <Text style={styles.driver}>
                  Ride:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {driver?.driver
                      ? driver?.driver?.vehicleInformation[0]?.vehicleCompany +
                        " " +
                        driver?.driver?.vehicleInformation[0]?.vehicleModel
                      : ""}
                  </Text>
                  {"\n\n"}
                  Driver:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {driver?.user
                      ? driver?.user?.firstName + " " + driver?.user?.lastName
                      : ""}
                  </Text>
                </Text>
                <Text style={styles.capacity}>
                  Starts at{"\n"}
                  <Text style={{ fontWeight: "bold" }}>
                    {new Date(ride.startTime).toLocaleString('en-US', options)}
                  </Text>
                </Text>
              </View>
              <View style={styles.rideContainer}>
                <Text style={styles.capacity}>
                  Seats:{" "}
                  <Text style={{ fontWeight: "bold" }}>{ride.capacity}</Text>
                </Text>
                <Text style={styles.capacity}>
                  Fare:{" "}
                  <Text style={{ fontWeight: "bold" }}>${ride.rideCost}</Text>
                </Text>
                <Text style={[styles.driver, { flex: 1 }]}>
                  <Pressable
                    style={[
                      submit,
                      { fontSize: 20, minWidth: 100, backgroundColor: "green"},
                    ]}
                    onPress={()=>{bookRide(ride)}}
                  >
                    <Text
                      style={[styles.text, { fontSize: 20, color: "#fff"}]}
                    >
                      Book
                    </Text>
                  </Pressable>
                </Text>
              </View>
            </View>
          );
        })
      )}
      <Pressable
        style={[
          submit,
          { marginTop: 15, marginLeft: 80, marginRight: 80, fontSize: 20 },
        ]}
        onPress={() => {
          navigation.navigate("FindRide");
        }}
      >
        <Text style={{ fontSize: 20 }}>Change Ride Preferences</Text>
      </Pressable>
    </View>
  );
};

export default Rides;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  text: {
    fontSize: 25,
    color: "#000",
    alignSelf: "center",
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
  rideBox: {
    backgroundColor: "#ffffff",
    padding: 5,
    margin: 6,
    borderColor: "black",
  },
  rideContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 6,
  },
  location: {
    fontSize: 12,
    flex: 2,
  },
  driver: {
    fontSize: 12,
    marginLeft: 2,
    flex: 2,
  },
  capacity: {
    fontSize: 12,
    marginRight: 2,
    flex: 1,
  },
});
