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
    const [currentRides, setCurrentRides] = useState([]);
    const [pastRides, setPastRides] = useState([]);
    const [currentDrives, setCurrentDrives] = useState([]);
    const [pastDrives, setPastDrives] = useState([]);
    
    const getRides = async () => {
      try {
        console.log('Debug');
        console.log('Debug');
        console.log('Debug');
        const response = await fetch(
          NGROK_TUNNEL + `/getRides?userId=${context.user._id}`,
          {
            method: "GET",
          }
        );
        console.log(response.ok);
        console.log('Debug');
        console.log('Debug');
        console.log('Debug');
        console.log('Debug');
        if (response.ok) {
          const rides = await response.json();
          console.log(rides);
          console.log('Debug');
          console.log('Debug');
          setCurrentRides(rides.currentRides);
          setPastRides(rides.pastRides);
        } else {
          console.error("Failed to fetch driver data");
        }
      } catch (error) {
        console.log("erorr in get rides "+error)
      }
    };

    const getDriverRides = async () => {
      try {
        console.log('Debug');
        console.log('Debug');
        console.log('Debug');
        const response = await fetch(
          NGROK_TUNNEL + `/getDriverRides?driverId=${context.user._id}`,
          {
            method: "GET",
          }
        );
        console.log(response.ok);
        console.log('Debug');
        console.log('Debug');
        console.log('Debug');
        if (response.ok) {
          console.log('Debug');
          console.log('Debug');
          const rides = await response.json();
          console.log(rides);
          console.log('Debug');
          console.log('Debug');
          setCurrentDrives(rides.currentRidesList);
          setPastDrives(rides.pastRidesList);
        } else {
          console.error("Failed to fetch driver data");
        }
      } catch (error) {
        console.log("erorr in get rides "+error)
      }
    };

    useEffect(() => {
      const refreshListener = navigation.addListener('focus', () => {
        getRides();
        getDriverRides();
      });
  
      return refreshListener;
    }, [navigation]);
    
    useEffect(() => {
      getRides();
      getDriverRides();
    }, []);

    useEffect(() => {
      getRides();
      getDriverRides();
    }, [context]);

    return (
      <View style = {styles.container}>
        <Image style={styles.bg} source={background}></Image>
        <ScrollView>
            <Text style={[styles.text, {textAlign: "center", fontSize: 32}]}>Your Rides</Text>
            <Text style={[styles.text, {marginTop: '4%', marginLeft: '2%'}]}>As a Passenger</Text>
            <View style={[styles.boundingBox, {marginTop: '2%', marginLeft: '2%', marginRight: '2%'}]}>
              <Text style={[styles.text, {marginTop: '2%', marginLeft: '2%', fontSize: 18}]}>Current</Text>
              {currentRides.length === 0 ? (
                <Text
                  style={[styles.text, { fontSize: 25, margin: '4%', color: "gray", marginTop: '4%' }]}
                >
                  No available rides
                </Text>
              ):(
                <Accordion data={currentRides} />
              )}
              <Text style={[styles.text, {marginTop: 20, marginLeft: 10, fontSize: 18}]}>Past</Text>
              {pastRides.length === 0 ? (
                <Text
                  style={[styles.text, { fontSize: 25, margin: '4%', color: "gray", marginTop: '4%' }]}
                >
                  No available rides
                </Text>
              ):(
                <Accordion data={pastRides} />
              )}
            </View>
            <Text style={[styles.text, {marginTop: '4%', marginLeft: '2%'}]}>As a Driver</Text>
            <View style={[styles.boundingBox, {marginTop: '2%', marginLeft: '2%', marginRight: '2%'}]}>
              <Text style={[styles.text, {marginTop: '2%', marginLeft: '2%', fontSize: 18}]}>Current</Text>
              {currentDrives.length === 0 ? (
                <Text
                  style={[styles.text, { fontSize: 25, margin: '4%', color: "gray", marginTop: '4%' }]}
                >
                  No available rides
                </Text>
              ):(
                <Accordion data={currentDrives} />
              )}
              <Text style={[styles.text, {marginTop: '2%', marginLeft: '2%', fontSize: 18}]}>Past</Text>
              {pastDrives.length === 0 ? (
                <Text
                  style={[styles.text, { fontSize: 25, margin: '4%', color: "gray", marginTop: '4%' }]}
                >
                  No available rides
                </Text>
              ):(
                <Accordion data={pastDrives} />
              )}
            </View>
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
      marginTop: "12%"
    },
    boundingBox: {
      padding: 10,
      borderWidth: 2,
      borderColor: 'rgba(235, 210, 95, 0.2)',
      borderRadius: 5,
      backgroundColor: 'rgba(0, 74, 172, 0.2)'
    }
  });