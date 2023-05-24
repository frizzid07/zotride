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
// Images
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

const SingleRide = (props) => {
  const ride = props.ride;
  return (
    <View style={styles.rideContainer}>
      <Text style={styles.text}>From : {ride.startLocation.description}</Text>
      <Text style={styles.text}>To : {ride.endLocation.description}</Text>
      <Text style={styles.text}>When : {ride.startTime}</Text>
      <Text style={styles.text}>${ride.rideCost}</Text>
    </View>
  );
};

export default SingleRide;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
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
    fontSize: 15,
    color: "#000",
  },
  buttontext: {
    fontSize: 13,
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
  locButton: {
    backgroundColor: "#fff",
    color: "#000",
    padding: 5,
    borderRadius: 6,
    borderColor: "#000",
    borderWidth: 2,
    fontSize: 25,
    fontFamily: "Roboto",
    fontWeight: "bold",
    minWidth: 100,
    minHeight: 50,
    textAlign: "center",
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  rideContainer: {
    width: "100%",
    margin: 20,
    borderRadius: 9,
    borderWidth: 2,
    justifyContent: "center",
    backgroundColor: "white",
  },
});
