import { View, TextInput, Button, StyleSheet, Modal, Text } from "react-native";
import { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

function SetLocation(props) {
  const [mapRegion, setmapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.inputContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => {
            console.log(data, details);
          }}
          query={{
            key: "AIzaSyCZ3WDFCoMW-7VjiNGQq1fqEXvPwrj_Lpg",
            language: "en",
          }}
          styles={styles.autoComplete}
        />
        <MapView style={styles.map} region={mapRegion}>
          <Marker coordinate={mapRegion} draggable={true}></Marker>
        </MapView>
      </View>
      <View>
        <Button title="Return" onPress={props.closeModal}></Button>
      </View>
    </Modal>
  );
}

export default SetLocation;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginBottom: 30,
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
  buttonsView: {
    flexDirection: "row",
  },

  button: {
    width: "30%",
    margin: 8,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
