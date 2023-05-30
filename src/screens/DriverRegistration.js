import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Pressable,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";

// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

// Common
import { submit } from "../common/button";
import { input } from "../common/input";

import { NGROK_TUNNEL } from "@env";
import { AuthContext } from "../../server/context/authContext";

const DriverRegistration = ({ navigation, route }) => {
  const context = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState(null);

  const [fillData, setFillData] = useState(route?.params?.driver);

  const [data, setData] = useState({
    userId: context.user._id,
    licenseNumber: "",
    vehicleInformation: {
      vehicleNumber: "",
      vehicleCompany: "",
      vehicleModel: "",
      vehicleColor: "",
      vehicleCapacity: "",
    },
  });

  useEffect(() => {
    console.log(`Filldata value ${fillData} ${JSON.stringify(fillData)}`);

    if(fillData !== undefined) {
      setData((data) => ({
        ...data,
        licenseNumber: fillData.licenseNumber,
        vehicleInformation: {
          ...data.vehicleInformation,
          vehicleNumber: fillData.vehicleInformation[0]?.vehicleNumber,
          vehicleCompany: fillData.vehicleInformation[0]?.vehicleCompany,
          vehicleModel: fillData.vehicleInformation[0]?.vehicleModel,
          vehicleColor: fillData.vehicleInformation[0]?.vehicleColor,
          vehicleCapacity: fillData.vehicleInformation[0]?.vehicleCapacity,
        },
      }));

      console.log(`New Data Value ${data}`);
    }
  }, []);

  const checkEditedData = (editData) => {
      if(data.licenseNumber != fillData.licenseNumber)
        editData.licenseNumber = data.licenseNumber;
      if(data.vehicleInformation.vehicleNumber != fillData.vehicleInformation[0]?.vehicleNumber || data.vehicleInformation.vehicleCompany != fillData.vehicleInformation[0]?.vehicleCompany 
        || data.vehicleInformation.vehicleModel != fillData.vehicleInformation[0]?.vehicleModel || data.vehicleInformation.vehicleColor != fillData.vehicleInformation[0]?.vehicleColor 
        || data.vehicleInformation.vehicleCapacity != fillData.vehicleInformation[0]?.vehicleCapacity ) {
        editData.vehicleInformation = [{}];
        if(data.vehicleInformation.vehicleNumber != fillData.vehicleInformation[0]?.vehicleNumber)
          editData.vehicleInformation[0].vehicleNumber = data.vehicleInformation.vehicleNumber;
        if(data.vehicleInformation.vehicleCompany != fillData.vehicleInformation[0]?.vehicleCompany)
          editData.vehicleInformation[0].vehicleCompany = data.vehicleInformation.vehicleCompany;
        if(data.vehicleInformation.vehicleModel != fillData.vehicleInformation[0]?.vehicleModel)
          editData.vehicleInformation[0].vehicleModel = data.vehicleInformation.vehicleModel;
        if(data.vehicleInformation.vehicleColor != fillData.vehicleInformation[0]?.vehicleColor)
          editData.vehicleInformation[0].vehicleColor = data.vehicleInformation.vehicleColor;
        if(data.vehicleInformation.vehicleCapacity != fillData.vehicleInformation[0]?.vehicleCapacity)
          editData.vehicleInformation[0].vehicleCapacity = data.vehicleInformation.vehicleCapacity;
      }
      return editData;
  }

  function clearErrMsg() {
    setErrorMsg(null);
  }
  
  async function registerDriver() {
    if (
      data.licenseNumber == "" ||
      data.vehicleInformation.vehicleNumber == "" ||
      data.vehicleInformation.vehicleCompany == "" ||
      data.vehicleInformation.vehicleModel == "" ||
      data.vehicleInformation.vehicleColor == "" ||
      data.vehicleInformation.vehicleCapacity == ""
    ) {
      setErrorMsg("Please Enter all Fields");
      return;
    }

    if(fillData !== undefined) {
      const editData = await checkEditedData({});
      console.log(`New Edit Data ${editData} ${JSON.stringify(editData)}`);

      if(Object.keys(editData).length === 0) {
        setErrorMsg("No Changes Made");
        alert("No edits made");
        return;
      }
    
      try {
        const response = await fetch(NGROK_TUNNEL + `/editDriver?driverId=${context.user._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({editData: editData}),
        });
        console.log(response.ok);
        if (response.ok) {
          console.log("Driver Updated");
          alert("Driver Record Updated");
          navigation.navigate("Landing");
        }
      } catch(error) {
        console.log("Could not update record");
        alert(error);
      }
    }

    else {
      try {
        const response = await fetch(NGROK_TUNNEL + "/driverRegistration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({data: data})
        });
        console.log(response.ok);
        const rdata = await response.json();
        console.log(rdata);
        console.log('One more');
        if (rdata.success) {
          console.log("Driver Registered Successfully");
          try {
            const response2 = await fetch(NGROK_TUNNEL + "/driverRegistration", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({data: data})
            });
            console.log(response2.ok);
            const rdata2 = await response2.json();
            console.log(rdata2);
            console.log('One more');
          } catch(error) {
            console.error(error);
          }
          navigation.navigate("Driver");
        } else {
          console.log("Some error in registering");
          navigation.navigate("DriverRegistration");
        }
      } catch (error) {
        console.log("Some error in registering as Driver " + error);
      } finally {}
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.bg} source={background}></Image>
      <ScrollView contentContainerStyle={styles.textContainer}>
        <TouchableOpacity>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        <Text style={[styles.text, { marginBottom: 25 }]}>
          Register as a Driver with us
        </Text>
        {errorMsg ? (
          <Text style={[styles.text, { color: "red", marginTop: -5 }]}>
            {errorMsg}
          </Text>
        ) : null}
        <Text style={styles.text}>License Number</Text>
        <TextInput
          style={input}
          placeholder="License Number"
          onPressIn={clearErrMsg}
          onChangeText={(text) => setData({ ...data, licenseNumber: text })}
          value={data.licenseNumber}
        />
        <Text style={styles.text}>Vehicle Number</Text>
        <TextInput
          style={input}
          placeholder="Vehicle Number"
          onPressIn={clearErrMsg}
          onChangeText={(text) =>
            setData({
              ...data,
              vehicleInformation: {
                ...data.vehicleInformation,
                vehicleNumber: text,
              },
            })
          }
          value={data.vehicleInformation.vehicleNumber}
        />

        <Text style={styles.text}>Car Details</Text>
        <TextInput
          style={input}
          placeholder="Company"
          onPressIn={clearErrMsg}
          onChangeText={(text) =>
            setData({
              ...data,
              vehicleInformation: {
                ...data.vehicleInformation,
                vehicleCompany: text,
              },
            })
          }
          value={data.vehicleInformation.vehicleCompany}
        />
        <TextInput
          style={input}
          placeholder="Model"
          onPressIn={clearErrMsg}
          onChangeText={(text) =>
            setData({
              ...data,
              vehicleInformation: {
                ...data.vehicleInformation,
                vehicleModel: text,
              },
            })
          }
          value={data.vehicleInformation.vehicleModel}
        />
        <TextInput
          style={input}
          placeholder="Color"
          onPressIn={clearErrMsg}
          onChangeText={(text) =>
            setData({
              ...data,
              vehicleInformation: {
                ...data.vehicleInformation,
                vehicleColor: text,
              },
            })
          }
          value={data.vehicleInformation.vehicleColor}
        />
        <TextInput
          style={input}
          placeholder="Capacity"
          onPressIn={clearErrMsg}
          onChangeText={(text) =>
            setData({
              ...data,
              vehicleInformation: {
                ...data.vehicleInformation,
                vehicleCapacity: text,
              },
            })
          }
          value={data.vehicleInformation.vehicleCapacity.toString()}
          keyboardType="number-pad"
        />
        <Pressable style={[submit, { marginTop: -5 }]}>
          <Text style={styles.text} onPress={registerDriver}>
            Register
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default DriverRegistration;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%"
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
  },
  innerContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  bg: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  text: {
    fontSize: 25,
    color: "#000",
  },
  logo: {
    width: "20%",
    height: undefined,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#ffde59",
    borderRadius: 5,
    marginBottom: 10,
  },
});
