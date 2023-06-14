import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Landing from "../screens/Landing";
import Driver from "../screens/Driver";
import Passenger from "../screens/Passenger";
import Confirm from "../screens/Confirm";
import Payment from "../screens/Payment";
import SuccessPayment from "../screens/SuccessPayment";
import CancelPayment from "../screens/CancelPayment";
import FindRide from "../screens/FindRide";
import Rides from "../screens/Rides";
import DriverRegistration from "../screens/DriverRegistration";
import ListRide from "../screens/ListRide";
import RideCard from "../common/RideCard";

const Stack = createNativeStackNavigator();

export default AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>      
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Driver" component={Driver} />
      <Stack.Screen name="Passenger" component={Passenger} />
      <Stack.Screen name="FindRide" component={FindRide} />
      <Stack.Screen name="Rides" component={Rides} />
      <Stack.Screen name="Confirm" component={Confirm} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="SuccessPayment" component={SuccessPayment} />
      <Stack.Screen name="CancelPayment" component={CancelPayment} />
      <Stack.Screen name="DriverRegistration" component={DriverRegistration} />
      <Stack.Screen name="ListRide" component={ListRide} />
      <Stack.Screen name="RideCard" component={RideCard} />
    </Stack.Navigator>
  );
};
