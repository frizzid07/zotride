import { StyleSheet, Text, TextInput, View, Image, Button, Pressable, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

// Images
import background from '../../assets/background.jpg';
import logo from '../../assets/logo.png';

// Common
import {submit} from '../common/button';
import {input} from '../common/input';

const Login = ({ navigation }) => {
  const [fdata, setFdata] = useState({
    username: '',
    password: ''
  })

  // const [isLoading, setLoading] = useState(false);
  // const [isSuccess, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  async function Sendtobackend() {
    // setLoading(true);
    // setSuccessMsg(false);
    // setErrorMsg(false);

    await fetch("https://d13a-128-195-97-60.ngrok-free.app/login", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(fdata)
      })
          .then(res => res.json()).then(
              data => {
                  console.log(data);
                  if (data.error) {
                      alert(data.error);
                      setErrorMsg("Invalid Credentials");
                  }
                  else {
                      alert('Logged in successfully');
                      navigation.navigate('Landing');
                  }
              }
          ).catch((error) => {
            // Handle any errors that occur
            console.error('Error:', error);
            // setErrorMsg(true);
        }).finally (()=> {
          // setLoading(false);
        });
    }

  return (
    <View style = {styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style = {styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style = {{fontSize: 25, color: '#000', marginBottom: 20}}>Login to your Account</Text>
        {
          errorMsg ? <Text style={[styles.text, {color: 'red'}]}>{errorMsg}</Text> : null
        }
        <TextInput style = {[input, {textTransform: 'lowercase'}]} placeholder="Email or Mobile Number" keyboardType='email-address' onPressIn={() => setErrorMsg(null)}
        onChangeText={(text) => setFdata({ ...fdata, username: text })} />
        <TextInput style = {input} placeholder="Password" secureTextEntry={true} onChangeText={(text) => setFdata({ ...fdata, password: text })}
        onPressIn={() => setErrorMsg(null)} />
        <Text style={{fontSize: 15, color: '#000', marginTop: 10, marginBottom: 20}}>Don't have an account?&nbsp;
          <Text style={{color: '#004aad'}} onPress={() => navigation.navigate('Register')}>Register Now!</Text>
        </Text>
        <Pressable style={submit} onPress={Sendtobackend}>
          <Text style={styles.text}>Login</Text>
        </Pressable>
      </View>
    </View>
  )};

export default Login

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
        marginBottom: 40
    }
});