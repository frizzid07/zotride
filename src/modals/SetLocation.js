import { View, TextInput, Button, StyleSheet, Modal, Text } from "react-native";
import React, { useState, createRef, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

function SetLocation(props) {
  const latDelta = 0.0922;
  const lngDelta = 0.0421;

  const MapRef = React.useRef();

  const [initialRegion, setinitialRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  });

  const [searchRegion, setSearchRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  });

  const [description, setDescription] = useState("2204 Pine St, San Francisco, CA 94115");

  function changeSearchRegion(data, details) {
    // console.log(data);
    // console.log(details);
    const desc = data.description;
    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;
    setDescription(desc);
    setSearchRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    });
    console.log("ChanginG Focus to new Address");
    MapRef.current.animateToRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    });
  }

  function confirmLocation() {
    alert("Location Confirmed");
    props.confirm({
      description: description,
      latitude: searchRegion.latitude,
      longitude: searchRegion.longitude,
    });
  }

  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.mapContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails={true}
          onPress={(data, details) => changeSearchRegion(data, details)}
          query={{
            key: "AIzaSyCZ3WDFCoMW-7VjiNGQq1fqEXvPwrj_Lpg",
            language: "en",
            components: "country:us",
          }}
          styles={styles.autoComplete}
        />
        <MapView ref={MapRef} style={styles.map} initialRegion={searchRegion}>
          <Marker coordinate={searchRegion} draggable={true}></Marker>
        </MapView>
      </View>
      <View style={styles.buttonsContainer}>
        <Button title="Return" onPress={props.closeModal}></Button>
        <Button title="Confirm" onPress={confirmLocation}></Button>
      </View>
    </Modal>
  );
}

export default SetLocation;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "pink",
  },
  autoComplete: {
    container: {
      flex: 0,
      position: "absolute",
      width: "100%",
      zIndex: 1,
    },
    listView: {
      backgroundColor: "white",
    },
  },
  textBox: {
    borderWidth: 1,
    borderColor: "pink",
    width: "90%",
    padding: 8,
  },
  buttons: {
    flex: 1,
  },

  button: {
    width: "30%",
    margin: 8,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
});
