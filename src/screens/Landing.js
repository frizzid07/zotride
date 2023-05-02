import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'

// Images
import background from '../../assets/background.jpg';

// Styles
import {submit} from '../common/button';

const Landing = ({ navigation, route }) => {

  return (
    <View style = {styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style = {styles.textContainer}>
        <Text style={styles.text}>Welcome to the landing page!</Text>
        <Text style={styles.text}>New content coming soon...</Text>
        <Pressable style={[submit, {marginTop: 20}]} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.text}>Logout</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Landing

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