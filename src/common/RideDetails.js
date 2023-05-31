import {
    StyleSheet,
    Text,
    View
  } from "react-native";

  
  const RideDetails = ({rideDetails, driverDetails, passengerDetails}) => {
    return (
      <View style={styles.rideBox}>
        <View style={styles.rideContainer}>
          <Text style={styles.location}>
            <Text style={{ fontWeight: "bold" }}>
              {rideDetails.startLocation.description}
            </Text>
          </Text>
          <Text> to </Text>
          <Text style={[styles.location, {textAlign: 'right'}]}>
            <Text style={{ fontWeight: "bold"}}>
              {rideDetails.endLocation.description}
            </Text>
          </Text>
        </View>
        <View style={styles.rideContainer}>
          <Text style={[styles.driver, {flex: 4}]}>
            Starts at{"\n"}
            <Text style={{ fontWeight: "bold" }}>
              {new Date(rideDetails.startTime).toLocaleString(undefined, {
                weekday: "short",
                day: "numeric",
                month: "long",
                hour: "numeric",
                minute: "numeric",
                timeZone: "America/Los_Angeles",
              })}
            </Text>
          </Text>
          {driverDetails && (
          <>
            <Text style={[styles.driver, { flex: 3 }]}>
              Driver{"\n"}
              <Text style={{ fontWeight: "bold" }}>
                {driverDetails.firstName} {driverDetails.lastName}
              </Text>
            </Text>
            <Text style={[styles.capacity, { flex: 1, textAlign: 'right' }]}>
              Fare{"\n"}
              <Text style={{ fontWeight: "bold" }}>
                ${rideDetails.rideCost}
              </Text>
            </Text>
          </>
        )}
          {passengerDetails && (
            <>
              <Text style={[styles.driver, { flex: 3, marginLeft: 15 }]}>
                Passengers{"\n"}
                {passengerDetails.length === 0 ? (
                  <Text style={{ color: "gray" }}>Empty</Text>
                ) : (
                  passengerDetails.map((passenger, i) => (
                    <Text key={i} style={{ fontWeight: "bold" }}>
                      {passenger.firstName} {passenger.lastName}{"\n"}
                    </Text>
                  ))
                )}
              </Text>
              <Text style={[styles.capacity, { flex: 2, textAlign: 'right' }]}>
                Earnings{"\n"}
                <Text style={{ fontWeight: "bold" }}>
                  ${passengerDetails.length * rideDetails.rideCost}
                </Text>
              </Text>
            </>
          )}
        </View>
      </View>
    );
  };
  
  export default RideDetails;
  
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
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
    rideBox: {
      backgroundColor: "#ffffff",
      padding: 8,
      margin: 8,
      borderColor: "black",
    },
    rideContainer: {
      flexDirection: "row",
      alignItems: "center",
      margin: 8,
    },
    location: {
      fontSize: 15,
      marginLeft: 5,
      flex: 2,
    },
    driver: {
      fontSize: 15,
      marginLeft: 5,
      flex: 2,
    },
    capacity: {
      fontSize: 15,
      flex: 1,
    },
  });
  