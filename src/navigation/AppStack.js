import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Landing from "../screens/Landing";
import Driver from "../screens/Driver";
// import Passenger from "../screens/Passenger";
import FindRide from "../screens/FindRide";
import Rides from "../screens/Rides";
import DriverRegistration from "../screens/DriverRegistration";
import ListRide from "../screens/ListRide";

const Stack = createNativeStackNavigator();

export default AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Driver" component={Driver} />
      <Stack.Screen name="FindRide" component={FindRide} />
      <Stack.Screen name="Rides" component={Rides} />
      <Stack.Screen name="DriverRegistration" component={DriverRegistration} />
      <Stack.Screen name="ListRide" component={ListRide} />
    </Stack.Navigator>
  );
};
