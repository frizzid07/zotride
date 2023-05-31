import {
    StyleSheet,
    Text,
    ScrollView,
    Image,
    View
  } from "react-native";
  import React, { useState, useContext, useEffect } from "react";
  
  // Images
  import background from "../../assets/background.jpg";
  
  import { NGROK_TUNNEL } from "@env";
  
  import { AuthContext } from "../../server/context/authContext";

  import Accordion from "../common/accordion";

  const PastRides = ({navigation}) => {
    const context = useContext(AuthContext);
    const [pastRides, setPastRides] = useState([]);
    const [pastDrives, setPastDrives] = useState([]);

    useEffect(() => {
      const getRides = async () => {

        try {
          console.log("hi hi")
          const response = await fetch(
            NGROK_TUNNEL + `/getRides?userId=${context.user._id}`,
            {
              method: "GET",
            }
          );
          console.log('Save us');
          console.log(response.ok)
          if (response.ok) {
            const rides = await response.json();
            console.log(rides);
            setPastRides(rides);
          } else {
            console.error("Failed to fetch driver data");
          }
        } catch (error) {
          console.log("erorr in get rides "+error)
        }
      };

      const getDriverRides = async () => {
        try {
          console.log("hi hi")
          const response = await fetch(
            NGROK_TUNNEL + `/getDriverRides?driverId=${context.user._id}`,
            {
              method: "GET",
            }
          );
          console.log('Save us');
          console.log(response.ok)
          if (response.ok) {
            const rides = await response.json();
            console.log(rides);
            setPastDrives(rides);
          } else {
            console.error("Failed to fetch driver data");
          }
        } catch (error) {
          console.log("erorr in get rides "+error)
        }
      };

      getRides();
      getDriverRides();
    }, []);

    return (
      <View style = {styles.container}>
        <Image style={styles.bg} source={background}></Image>
        <ScrollView>
            <Text style={[styles.text, {textAlign: "center", fontSize: 32}]}>Past Rides</Text>
            <Text style={[styles.text, {marginTop: 20, marginLeft: 10}]}>As a Passenger</Text>
            {pastRides.length === 0 ? (
              <Text
                style={[styles.text, { fontSize: 25, margin: 20, color: "gray" }]}
              >
                No available rides
              </Text>
            ):(
              <Accordion data={pastRides} />
            )}
            <Text style={[styles.text, {marginTop: 20, marginLeft: 10}]}>As a Driver</Text>
            {pastDrives.length === 0 ? (
              <Text
                style={[styles.text, { fontSize: 25, margin: 20, color: "gray" }]}
              >
                No available rides
              </Text>
            ):(
              <Accordion data={pastDrives} />
            )}
        </ScrollView>
      </View>
    );
  };

  export default PastRides;

  const styles = StyleSheet.create({
    container: {
      flex:1
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
      marginTop: "15%"
    }
  });