import { StyleSheet, Text, TextInput, View, Image, Button, Pressable, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';

// Images
import background from '../../assets/background.jpg';
import logo from '../../assets/logo.png';

// Common
import {submit} from '../common/button';
import {input} from '../common/input';

import { AuthContext } from '../../server/context/authContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NGROK_TUNNEL} from "@env";

const Verify = ({ navigation, route }) => {
    const context = useContext(AuthContext);
    const { userdata } = route.params;

    const [errorMsg, setErrorMsg] = useState(null);
    const [userCode, setUserCode] = useState('XXXX');
    const [actualCode, setActualCode] = useState(null);

    useEffect(() => {
        setActualCode(userdata.VerificationCode);
    }, [])

    async function Sendtobackend() {
        if (userCode == 'XXXX' || userCode == '') {
            setErrorMsg('Please enter the code');
            return;
        }

        else if (userCode == actualCode) {
            console.log('Fetching Register API');
            const userData = {
                firstName: userdata.user[0]?.firstName,
                lastName: userdata.user[0]?.lastName,
                dayOfBirth: userdata.user[0]?.dayOfBirth,
                monthOfBirth: userdata.user[0]?.monthOfBirth,
                yearOfBirth: userdata.user[0]?.yearOfBirth,
                isDriver: false,
                mobileNumber: userdata.user[0]?.mobileNumber,
                email: userdata.user[0]?.email,
                password: userdata.user[0]?.password
            }
            try {
                const response = await fetch(NGROK_TUNNEL + "/register", {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(userData)
                });
              
                console.log(response.ok);
                const data = await response.json();
                console.log(data);
                console.log('In Verify');
              
                if (data.message === 'User Registered Successfully') {
                    await AsyncStorage.setItem('user', JSON.stringify(userData));
                    alert(data.message);
                  navigation.navigate('Login');
                } else {
                  alert("Something went wrong !! Try Signing Up Again");
                  navigation.navigate('Register');
                }
              } catch (error) {
                // Handle any errors that occur
                alert(error);
                console.error(error);
              } finally {}              
        }
        else {
            setErrorMsg('Incorrect code');
            alert('Please enter a valid code');
            return;
        }
    }
    return (
        <View style = {styles.container}>
            <Image style={styles.bg} source={background} />
            <View style = {styles.textContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
                    <Image style={styles.logo} source={logo} />
                </TouchableOpacity>
                <Text style = {styles.text}>Verify your Email</Text>
                <Text style = {[styles.text, {fontSize: 15}]}>A code has been sent to your email!</Text>
                {
                    errorMsg ? <Text style={[styles.text, {color: 'red', marginBottom: -10, marginTop: 5}]}>{errorMsg}</Text> : null
                }
                <Text style = {[styles.text, {fontSize: 15, marginTop: 30}]}>Code</Text>
                <TextInput style={input} placeholder="Enter 6-digit Verification Code" secureTextEntry={true} onChangeText={(text) => setUserCode(text)} onPressIn={() => setErrorMsg(null)} />
                <Text style={{fontSize: 15, color: '#000', marginTop: 10, marginBottom: 20}}>Want to Login with another account?&nbsp;
                    <Text style={{color: '#004aad'}} onPress={() => navigation.navigate('Login')}>Go to Login Page!</Text>
                </Text>
                <Text style={{fontSize: 15, color: '#000', marginTop: 10, marginBottom: 20}}>Do not have an account?&nbsp;
                    <Text style={{color: '#004aad'}} onPress={() => navigation.navigate('Register')}>Register a new account!</Text>
                </Text>
                <Pressable style={submit} onPress={Sendtobackend}>
                    <Text style={styles.text}>Verify</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default Verify

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
    innerContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'flex-start'
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
        width: '20%',
        height: undefined,
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: '#ffde59',
        borderRadius: 5,
        marginBottom: 20
    }
});