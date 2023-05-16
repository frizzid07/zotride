import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'

// Images
import background from '../../assets/background.jpg';
import logo from '../../assets/logo.png';

// Styles
import { submit } from '../common/button';

import { AuthContext } from '../../server/context/authContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const Landing = ({ navigation}) => {
  const context = useContext(AuthContext);
  // const token = route.params.userdata.token;

  return (
    <View style = {styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style = {styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style = {{fontSize: 25, color: '#000', marginBottom: 20}}>Welcome to ZotRide, {context.user.firstName}</Text>
        <Text style = {{fontSize: 25, color: '#000', marginBottom: 20}}>Choose a Role</Text>
        <Pressable style={submit} onPress={() => navigation.navigate('Driver')}>
          <Text style={styles.text}>Driver</Text>
        </Pressable>
        <Pressable style={submit} onPress={() => navigation.navigate('Passenger')}>
          <Text style={styles.text}>Passenger</Text>
        </Pressable>
        <Pressable style={[submit, {minWidth: 100, minHeight: 30, borderRadius: 3}]} onPress={context.logout}>
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