import { StyleSheet, Text, View, Image, Button, Alert, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'

// Images
import background from '../../assets/background.jpg';
import logo from '../../assets/logo.png';

// Common
import {submit} from '../common/button';

const CancelPayment = ({ navigation }) => {

  return (
    <View style = {styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style = {styles.textContainer}>
        <TouchableOpacity>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={[styles.text, {marginBottom: 40}]}>Payment failed or cancelled</Text>
        <Pressable style={submit} onPress={() => navigation.navigate('Landing')}>
            <Text style={styles.text}>Back to Home</Text>
          </Pressable>
      </View>
    </View>
  )
}

export default CancelPayment

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
      width: "60%",
      height: undefined,
      aspectRatio: 2.5
    },
});