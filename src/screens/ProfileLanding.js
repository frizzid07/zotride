import {
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    TouchableOpacity,
  } from "react-native";
  import React, { useContext, useEffect, useState } from "react";
  import { NGROK_TUNNEL } from "@env";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";
import { Ionicons } from "react-native-vector-icons";

// Styles
import { submit } from "../common/button";

import { AuthContext } from "../../server/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setDriver } from "mongoose";


const ProfileLanding = ({navigation})=>{

  const context = useContext(AuthContext)
  const [isDriver, setIsDriver] = useState(context.user.isDriver)

  return(
    <View style={styles.container}>
    <Image style={styles.bg} source={background}></Image>
    <View style={styles.profileContainer}>
      <View style={styles.profileDetails}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileNameText}>{context.user.firstName + " " + context.user.lastName}</Text>
          </View>
          <Text style={styles.profileText}>{context.user.email}</Text>
          <Text style={styles.profileText}>{context.user.mobileNumber}</Text>
          <View style={styles.profileHeader}>
          <Pressable
          style={[submit, { minWidth: 100, minHeight: 30, borderRadius: 3, backgroundColor:"#004aac" }]}
          onPress={context.logout}
        >
          <Text style={[styles.smallText,{color:"#ebd25f"}]}>Edit Profile</Text>
        </Pressable>
        <Pressable
          style={[submit, { minWidth: 100, minHeight: 30, borderRadius: 3, backgroundColor:"#ebd25f"}]}
          onPress={context.logout}
        >
          <Text style={[styles.smallText,{color:"#004aac"}]}>Logout</Text>
        </Pressable>
          </View>
      </View>
    </View>
    <View style={styles.textContainer}>

        <Pressable
          style={[submit, { minWidth: 100, minHeight: 30, borderRadius: 3}]}
          onPress={context.logout}
        >
          <Text style={styles.text}>Past Rides</Text>
        </Pressable>

        {isDriver && <Pressable
          style={[submit, { minWidth: 100, minHeight: 30, borderRadius: 3 }]}
          onPress={context.logout}
        >
          <Text style={styles.text}>Edit Registration</Text>
        </Pressable>}
        </View>
    </View>
  )
}

export default ProfileLanding;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems:"center"
  },
  textContainer: {
    display: "flex",
    height: "100%",
    alignItems:"center"
  },
  bg: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    backgroundColor: 'white',
    padding : 15,
    marginTop:100,
    maxWidth:"90%",
    justifyContent:"center"
  },
  smallText:{
    fontSize:15
  },
  text: {
    fontSize: 25,
    color: "#000",
  },
  logo: {
    width: "40%",
    height: undefined,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: "#ffde59",
    borderRadius: 5,
    marginBottom: 40,
  },
  profileImageContainer: {
    width: 80,
    height:80,
    borderRadius: 40,
    backgroundColor: 'black',
    marginRight: 15,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    resizeMode: 'cover',
  },
  profileDetails: {
    flex: 1,
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems:'center'
  },
  profileText: {
    fontSize: 15,
    marginBottom: 1,
  },
  profileNameText: {
    fontSize: 18,

    fontWeight: 'bold',
    marginBottom: 1,
  },
  editButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
});