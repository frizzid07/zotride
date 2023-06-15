import {
    StyleSheet,
    Text,
    Pressable,
    View
  } from "react-native";

import { submit } from "./button";
import { NGROK_TUNNEL } from "@env";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../server/context/authContext";

  const RideDetails = ({rideDetails, driverDetails, passengerDetails, edit}) => {
    const context = useContext(AuthContext);

    async function endTrip() {
      try {
        const response = await fetch(NGROK_TUNNEL+`/endTrip?userId=${context.user._id}&rideId=${rideDetails._id}`, {
          method: "GET"
        });
        console.log(response.ok);
        if(response.ok) {
          let activeRides = context.user.activePassengerRides.filter((x) => x !== rideDetails._id);
          context.user.activePassengerRides = activeRides;
          context.user.past_rides = [...context.user.past_rides, rideDetails._id];
          alert("Trip ended successfully!");
          navigation.pop();
        }
      } catch(error) {
        console.error(error);
      }
    }

    async function cancelTrip() {
      try {
          const response = await fetch(NGROK_TUNNEL+`/cancelTrip?userId=${context.user._id}&rideId=${rideDetails._id}`, {
            method: "GET"
          });
          console.log(response.ok);
          if(response.ok) {
            let activeRides = context.user.activePassengerRides.filter((x) => x !== rideDetails._id);
            context.user.activePassengerRides = activeRides;
            alert("Trip cancelled successfully!");
            navigation.pop();
          }
        } catch(error) {
        console.error(error);
      }
    }
    
    return (
      <View style={styles.rideBox}>
        <View style={styles.rideContainer}>
          <Text style={styles.location}>
            <Text style={{ fontWeight: "bold" }}>
              {rideDetails.startLocation.description}
            </Text>
          </Text>
          <Text> to </Text>
          <Text style={[styles.location, {textAlign: 'right'}]}>
            <Text style={{ fontWeight: "bold"}}>
              {rideDetails.endLocation.description}
            </Text>
          </Text>
        </View>
        <View style={styles.rideContainer}>
          <Text style={[styles.driver, {flex: 4}]}>
            Starts at{"\n"}
            <Text style={{ fontWeight: "bold" }}>
              {new Date(rideDetails.startTime).toLocaleString(undefined, {
                weekday: "short",
                day: "numeric",
                month: "long",
                hour: "numeric",
                minute: "numeric",
                timeZone: "America/Los_Angeles",
              })}
            </Text>
          </Text>
          {driverDetails && (
          <>
            <Text style={[styles.driver, { flex: 3 }]}>
              Driver{"\n"}
              <Text style={{ fontWeight: "bold" }}>
                {driverDetails.firstName} {driverDetails.lastName}
              </Text>
            </Text>
            <Text style={[styles.capacity, { flex: 1, textAlign: 'right' }]}>
              Fare{"\n"}
              <Text style={{ fontWeight: "bold" }}>
                ${rideDetails.rideCost}
              </Text>
            </Text>
          </>
        )}
          {passengerDetails && (
            <>
              <Text style={[styles.driver, { flex: 3, marginLeft: 15 }]}>
                Passengers{"\n"}
                {passengerDetails.length === 0 ? (
                  <Text style={{ color: "gray" }}>Empty</Text>
                ) : (
                  passengerDetails.map((passenger, i) => (
                    <Text key={i} style={{ fontWeight: "bold" }}>
                      {passenger.firstName} {passenger.lastName}{"\n"}
                    </Text>
                  ))
                )}
              </Text>
              <Text style={[styles.capacity, { flex: 2, textAlign: 'right' }]}>
                Earnings{"\n"}
                <Text style={{ fontWeight: "bold" }}>
                  ${passengerDetails.length * rideDetails.rideCost}
                </Text>
              </Text>
            </>
          )}
          {edit && (
          <>
            <Pressable
                style={[styles.capacity,
                  submit,
                  { fontSize: 15, minWidth: 65, flex: 1, backgroundColor: "rgba(0, 74, 172, 0.8)"},
                ]}
                onPress={endTrip}
              >
                <Text
                  style={[styles.text, { fontSize: 15, color: "#fff"}]}
                >
                  End
                </Text>
              </Pressable>
              <Pressable
                style={[styles.capacity,
                  submit,
                  { fontSize: 15, minWidth: 65, flex: 1, backgroundColor: "rgba(194, 24, 7, 0.8)"},
                ]}
                onPress={cancelTrip}
              >
                <Text
                  style={[styles.text, { fontSize: 15, color: "#fff"}]}
                >
                  Cancel
                </Text>
              </Pressable>
          </>)}
        </View>
      </View>
    );
  };
  
  export default RideDetails;
  
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
      borderWidth: 2,
      borderRadius: 10,
      padding: 8,
      margin: 8,
      borderColor: "black",
    },
    rideContainer: {
      flexDirection: "row",
      alignItems: "center",
      margin: 8,
    },
    location: {
      fontSize: 15,
      marginLeft: 5,
      flex: 2,
    },
    driver: {
      fontSize: 15,
      marginLeft: 5,
      flex: 2,
    },
    capacity: {
      fontSize: 15,
      flex: 1,
    },
  });
  