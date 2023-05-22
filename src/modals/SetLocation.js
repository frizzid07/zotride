import { View, TextInput, Button, StyleSheet, Modal, Text } from "react-native";
import { useState } from "react";
import MapView, { Marker } from "react-native-maps";

function SetLocation(props) {
  const [mapRegion, setmapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <Modal visible={props.visible} animationType="slide" style={styles.modal}>
      <View style={styles.inputContainer}>
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
  modal: {
    marginTop: 500,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "pink",
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
