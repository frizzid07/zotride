import { StyleSheet, Text, View, Image, Button, Alert, Pressable, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'

// Images
import background from '../../assets/background.jpg';
import logo from '../../assets/logo.png';

// Common
import {submit} from '../common/button';
import { AuthContext } from '../../server/context/authContext';

const SuccessPayment = ({ navigation, route }) => {
  const context = useContext(AuthContext);
  const { data, ride } = route?.params;

  useEffect(() => {
    context.user.activePassengerRides = [...context.user.activePassengerRides, ride._id];
    console.log(`New Context: ${JSON.stringify(context)}`);
  }, []);

  useEffect(() => {
    navigation.navigate('Landing');
  }, [context]);

  return (
    <View style = {styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <View style = {styles.textContainer}>
        <TouchableOpacity>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        { data.failed_transactions.length == 0 ? 
        <View>
          <Text style={[styles.text, {marginBottom: 40}]}>Payment successful!</Text>
          <Text style={[styles.text, {marginBottom: 50}]}>Transaction ID{'\n'}<Text style={{fontSize: 20}}>{data.id}</Text></Text>
          <Text style={[styles.text, {marginBottom: 30}]}>Payment of {data.transactions[0]?.amount.currency + ' ' + data.transactions[0]?.amount.total} successfully received by {data.transactions[0]?.payee.email}</Text>
          <Pressable style={submit} onPress={() => navigation.navigate("Confirm", { ride: ride })}>
            <Text style={styles.text}>View Confirmation</Text>
          </Pressable>
          <Pressable style={submit} onPress={() => navigation.navigate('Landing')}>
            <Text style={styles.text}>Back to Home</Text>
          </Pressable>
        </View>
        :
        <Text style={styles.text}>Transaction failed</Text>
        }
      </View>
    </View>
  )
}

export default SuccessPayment

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
        color: '#000',
        textAlign: 'center'
    },
    logo: {
        width: '20%',
        height: undefined,
        borderWidth: 2,
        borderColor: '#ffde59',
        borderRadius: 5,
        aspectRatio: 1,
        marginBottom: 30
    }
});