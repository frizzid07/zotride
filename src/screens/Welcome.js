import { StyleSheet, Text, View, Image, Button, Alert, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'

// Images
import background from '../../assets/background.jpg';
import logo from '../../assets/logo.png';

// Common
import {submit} from '../common/button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Welcome = ({ navigation }) => {
  
  useEffect(() => {
    const clearAsyncStorage = async() => {
      try {
        await AsyncStorage.removeItem('user');
        } catch (error) {
          console.log(error);
        }
      }
      clearAsyncStorage();
    }, []);

  return (
    <View style = {styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style = {styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Pressable style={submit} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.text}>Login</Text>
        </Pressable>
        <Pressable style={submit} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.text}>Register</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Welcome

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
        width: '60%',
        height: undefined,
        borderWidth: 2,
        borderColor: '#ffde59',
        borderRadius: 5,
        aspectRatio: 1,
        marginBottom: 100
    }
});