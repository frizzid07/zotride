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
import React, { useState, useContext, useEffect, useRef } from "react";

// Images
import background from "../../assets/background.jpg";

// Common
import { submit } from "../common/button";

import { NGROK_TUNNEL } from "@env";
import axios from "axios";

import { AuthContext } from "../../server/context/authContext";

import RideFilters from "../modals/RideFilters";

import RideCard from "../common/RideCard";

const Rides = ({ navigation, route }) => {
  const context = useContext(AuthContext);
  const [rides, setRides] = useState(route.params.rides);
  const [drivers, setDrivers] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    "startRadius":5,
    "endRadius":5,
    "timeWindow":30,
    "maxCapacity":4,
    "maxCost":100
  });
  const isInitialRender = useRef(true);


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
        console.log('Debug');
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

  

  useEffect( () => {

    async function filterRides () {
    try {
      var requestBody = {
        "startLocation":route.params.initialParams.startLocation,
        "endLocation":route.params.initialParams.endLocation,
        "startRadius":filters.startRadius,
        "endRadius":filters.endRadius,
        "startTime":route.params.initialParams.startTime,
        "timeWindow":filters.timeWindow,
        "maxRideCost":filters.maxCost,
        "maxCapacity":filters.maxCapacity
      }
      const response = await fetch(NGROK_TUNNEL + "/filterRides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      console.log("mandatory log");
      if (!response.ok) {
        alert("Could not filter rides");
      }
      setRides(data);
    } catch (error) {
      console.log("Some error in filtering rides API " + error);
    }
    }

    if (isInitialRender.current) {
      isInitialRender.current = false;
      console.log("first render, do not call find rides")
      return;
    }
    console.log('Filters changed, call filter ride API');
    console.log("filters set to "+JSON.stringify(filters));
    
    filterRides();
    
  }, [filters]);

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  function changePreferencesHandler () {
    setFilterModalVisible(true)
  }

  function handleFilters (filterValues) {
    setFilters(filterValues);
  }


  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background} />
      <ScrollView>
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
              <RideCard key={index} driverDetail={driver} rideDetails={ride} navigation={navigation}></RideCard>
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
        <Pressable
          style={[
            submit,
            { marginTop: 15, marginLeft: 80, marginRight: 80, fontSize: 20 },
          ]}
          onPress={changePreferencesHandler}
        >
          <Text style={{ fontSize: 20 }}>Manage Filters</Text>
        </Pressable>
        {filterModalVisible  && <RideFilters visible={filterModalVisible} onClose = {closeFilterModal} handleFilters={handleFilters} default={filters}></RideFilters>}
      </ScrollView>
    </View>
  );
};

export default Rides;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    marginBottom: '40%'
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
