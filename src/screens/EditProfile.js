import { StyleSheet, Text, View, Image, Button, Pressable, Alert, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'

// Images
import background from '../../assets/background.jpg';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../server/context/authContext';
// Common
import {submit} from '../common/button';
import {input} from '../common/input';

import {NGROK_TUNNEL} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = ({ navigation, route }) => {
  const context = useContext(AuthContext)
  const [fillData, setFillData] = useState(route?.params?.user)
  const [fdata, setFdata] = useState({
    firstName: '',
    lastName: '',
    dayOfBirth: '',
    monthOfBirth: '',
    yearOfBirth: '',
  });


  useEffect(()=>{
    console.log(`FillData is ${fillData.yearOfBirth}`)

    if(fillData !== undefined){
        setFdata((fdata)=>({
            ...fdata,
            firstName:fillData.firstName,
            lastName:fillData.lastName,
            dayOfBirth:fillData.dayOfBirth,
            monthOfBirth:fillData.monthOfBirth,
            yearOfBirth:fillData.yearOfBirth,

        }))
    }

  },[]);

  const [errorMsg, setErrorMsg] = useState(null);

  const updateUser = async() => {
    const userJSON = await AsyncStorage.getItem('user');
    let user = JSON.parse(userJSON);

    user.firstName = context.user.firstName;
    user.lastName = context.user.lastName;
    user.dayOfBirth = context.user.dayOfBirth;
    user.monthOfBirth = context.user.monthOfBirth;
    user.yearOfBirth = context.user.yearOfBirth;

    // Save the updated user object to AsyncStorage
    await AsyncStorage.setItem('user', JSON.stringify(user));
  }

  useEffect(() => {
    updateUser();
  }, [context.user]);

  async function EditData() {
    if (fdata.firstName == '' ||
        fdata.lastName == '' ||
        fdata.dayOfBirth == '' ||
        fdata.monthOfBirth == '' ||
        fdata.yearOfBirth == '') {
        setErrorMsg('All fields are required');
        return;
    }
    else {
        console.log('Editing Details');
        try {
        console.log(fillData._id)
          const response = await fetch(NGROK_TUNNEL+ `/editProfile?id=${fillData._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({data:fdata})
          });
          console.log("Why Bro")
          console.log(response.ok);
          console.log('Debug');
          if (response.ok) {
            console.log("User Updated");
            context.updateUser({firstName:fdata.firstName,
                lastName:fdata.lastName,
                dayOfBirth:fdata.dayOfBirth,
                monthOfBirth:fdata.monthOfBirth,
                yearOfBirth:fdata.yearOfBirth})
            alert("Your Record is Updated");
            navigation.pop();
          }
        } catch (error) {
          // Handle any errors that occur
          alert(error.message);
          console.error('Error:', error);
        }
      }
  }

  return (
    <View style = {styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <ScrollView contentContainerStyle = {styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        {
          errorMsg ? <Text style={[styles.text, {color: 'red', marginTop: -5}]}>{errorMsg}</Text> : null
        }
        <Text style = {[styles.text, {fontSize: 15, marginBottom: -5}]}>Name</Text>
        <View style = {styles.innerContainer}>
          <TextInput style = {[input, {flex: 1, minWidth: 100}]} placeholder="First Name" onPressIn={() => setErrorMsg(null)}
          value = {fdata.firstName}
            onChangeText={(text) => setFdata({ ...fdata, firstName: text })}/>
          <TextInput style = {[input, {flex: 1, minWidth: 100}]} placeholder="Last Name" onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, lastName: text })}
            value = {fdata.lastName}
            />
        </View>
        <Text style = {[styles.text, {fontSize: 15, marginBottom: -5}]}>Date of Birth</Text>
        <View style = {styles.innerContainer}>
          <TextInput style = {[input, {flex: 2, minWidth: 50}]} placeholder="Month" keyboardType='number-pad' onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, monthOfBirth: text })}
            value = {fdata.monthOfBirth.toString()}
            />
          <TextInput style = {[input, {flex: 2, minWidth: 50}]} placeholder="Day" keyboardType='number-pad' onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, dayOfBirth: text })}
            value = {fdata.dayOfBirth.toString()}
            />
          <TextInput style = {[input, {flex: 3, minWidth: 100}]} placeholder="Year" keyboardType='number-pad' onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, yearOfBirth: text })}
            value = {fdata.yearOfBirth.toString()}
            />
        </View>
        <Pressable style={[submit, {marginTop:50}]} onPress={EditData}>
          <Text style={styles.text}>Edit</Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
      width: '100%',
      height: '100%'
  },
  textContainer: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-start',
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
    width: "70%",
    height: undefined,
    aspectRatio: 2.5
  },
});