import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../../server/context/authContext';
import {NGROK_TUNNEL} from "@env"


const RideCard = ({ navigation, driverDetail, rideDetails }) => {

    const [showRideDetails, setShowRideDetails] = useState(false);
    const context = useContext(AuthContext);

    const handlePress = () => {
      setShowRideDetails(!showRideDetails);
    };

    const options = {
      weekday: "short",
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric",
      timeZone: "America/Los_Angeles",
    }

    async function bookRide(ride) {
      const data = {
        "rideId": ride._id,
        "userId": context.user._id
      }
      try {
        console.log("log log");
        console.log("log log");
        const response = await fetch(NGROK_TUNNEL + "/bookRide", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log(response.ok);
        console.log("log log");
        console.log("log log");
        const rdata = await response.json();
        console.log(rdata);
        console.log('In Book Ride');
        if(response.ok) {
          navigation.navigate("Payment", {ride: ride});
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
      <>
      <View>
      <Pressable style={styles.rideCard} onPress={handlePress}>
        <View style={styles.rideInfo}>
          <Text style={styles.rideName}>{driverDetail?.user?.firstName + " " + driverDetail?.user?.lastName+" "}:
          {" "+driverDetail?.driver?.vehicleInformation[0]?.vehicleCompany+" "+driverDetail?.driver?.vehicleInformation[0]?.vehicleModel} </Text>
          {!showRideDetails && 
          <View>
            <Text style={styles.rideDescription}>Click for more details</Text>
            <Text style={styles.ridePrice}>{rideDetails?.rideCost}$</Text>
          </View>
          }
          {showRideDetails && 
          <View>
            <Text style={styles.rideDescription}>Starts at: {rideDetails.startLocation.description}</Text>
            <Text style={styles.rideDescription}>Ends at: {rideDetails.endLocation.description}</Text>
            <Text style={styles.rideDescription}>Upto {rideDetails.capacity-1} more person(s) may travel with you on this ride</Text>
            <Text style={styles.rideDescription}><Icon name="clock-o" size={18} color="black" /> {new Date(rideDetails.startTime).toLocaleString('en-US',options)}</Text>
            <Text style={styles.ridePrice}>{rideDetails?.rideCost}$</Text>
            <Pressable style={styles.button} onPress={() => bookRide(rideDetails)}>
              <Text style={styles.buttonText}>Book Now!</Text>
            </Pressable>
          </View>
          }
        </View>
        <View style={styles.rideAmount}>
          {showRideDetails && <Icon name="angle-up" size={20} color="#000" />}
          {!showRideDetails && <Icon name="angle-down" size={20} color="#000" />}
        </View>
      </Pressable>
      </View>
      <View style={styles.line} />
      
      </>
    );
  };

  export default RideCard;

  const styles = StyleSheet.create({
    button: {
      backgroundColor: '#007AFF', // Adjust the button color as desired
      borderRadius: 20, // Adjust the border radius to make the button more or less rounded
      paddingVertical: 10,
      paddingHorizontal: 20,
      margin:'3%'
    },
    buttonText: {
      color: '#FFFFFF', // Adjust the text color as desired
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    line: {
      height: 3,
      backgroundColor: '#C0C0C0',
    },
    rideList: {
      flex: 1,
      paddingTop: 16,
    },
    rideCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#E8E8E8',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      padding: 16,
      marginHorizontal: '3%',
    },
    rideImage: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginRight: 16,
    },
    rideInfo: {
      flex: 1,
      marginRight: 16,
    },
    rideName: {
      fontSize: 18,
      marginBottom: 4,
      fontFamily: 'Roboto',
    },
    rideDescription: {
      fontSize: 14,
      color: '#666',
      marginBottom: '3%',
    },
    ridePrice: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#4caf50',
      marginBottom: '3%'
    },
    ridePriceText: {
      fontSize: 14,
      fontWeight: 'normal',
      color: '#666',
    },
    rideAmount: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    amountButton: {
      width: 30,
      height: 30,
      backgroundColor: '#ffa726',
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    amountButtonText: {
      color: '#fff',
      fontSize: 18,
    },
    amountText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginHorizontal: 16,
    },
  });
  