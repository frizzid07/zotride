import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useContext, useEffect} from 'react'
import Accordion from "../common/accordion";
import { AuthContext } from "../../server/context/authContext";
import { NGROK_TUNNEL } from "@env";

// Images
import background from '../../assets/background.jpg';
import logo from '../../assets/logo.png';

// Styles
import {submit} from '../common/button';

const Passenger = ({ navigation }) => {
    const context = useContext(AuthContext);
    const [hasActivePass, setHasActivePass] = useState(false);
    const [activeRidesPass, setActiveRidesPass] = useState({});
    const [refresh, setRefresh] = useState(false);

    const refreshPassengerScreen = () => {
        setRefresh(prevRefresh => !prevRefresh);
    };

    async function checkActiveRidePass() {
        console.log("Checking if Passenger has an Active ride");
        if(context.user.activePassengerRides.length !== 0) {
            try {
                let rides = []
                for (const ride of context.user.activePassengerRides) {
                        try {
                        console.log('Debug');
                        const response = await fetch(NGROK_TUNNEL + `/getRide?rideId=${ride}`, {
                            method: "GET"
                        });
                        console.log(response.ok);
                        console.log('Debug');
                        console.log('Debug');
                        const rdata = await response.json();
                        rides.push({"rideDetails":rdata.ride});
                        console.log(rides);
                    } catch(err) {
                        console.log(err);
                    }
                }            
                setActiveRidesPass(rides);
                setHasActivePass(true);
            } catch (err) {
                console.log("Some backend error");
                console.log(err);
            }
        } else {
            setHasActivePass(false);
        }
    }

    useEffect(() => {
        checkActiveRidePass();
    }, [refresh]);
    
    useEffect(() => {
        const refreshListener = navigation.addListener('focus', () => {
            checkActiveRidePass();
        });
    
        return refreshListener;
      }, [navigation]);
    
    return (
        <View style = {styles.container}>
            <Image style={styles.bg} source={background}></Image>
            <ScrollView>
                <View style = {styles.textContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
                        <Image style={[styles.logo, {width: "25%"}]} source={logo} />
                    </TouchableOpacity>
                    <Text style={styles.text}>Welcome, {context.user.firstName}</Text>
                    <View style={{ width: "75%", marginTop: 25 }}>
                        <Pressable
                        style={submit}
                        onPress={() => navigation.navigate("FindRide")}
                        >
                        <Text style={styles.text}>Find a New Ride</Text>
                        </Pressable>
                    </View>
                    {hasActivePass &&
                        <View style={{ width: '100%', marginTop: 10 }}>
                            <Text style={[styles.text, {marginTop: 20, marginLeft: 10, fontSize: 20}]}>Your Active Rides</Text>
                            <Accordion data={activeRidesPass} edit={true} refreshPassengerScreen={refreshPassengerScreen}/>
                        </View>}
                </View>
            </ScrollView>
        </View>
    )
}

export default Passenger

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    textContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    bg: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
    },
    text: {
        fontSize: 25,
        color: '#000'
    },
    logo: {
        width: '40%',
        height: undefined,
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: '#ffde59',
        borderRadius: 5,
        marginTop: 100,
        marginBottom: 40
    }
});