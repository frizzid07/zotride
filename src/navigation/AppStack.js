import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Landing from '../screens/Landing';
import Driver from '../screens/Driver';
import Passenger from '../screens/Passenger';

const Stack = createNativeStackNavigator();

export default AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='Landing' component={Landing} />
      <Stack.Screen name='Driver' component={Driver} />
      <Stack.Screen name='Passenger' component={Passenger} />
    </Stack.Navigator>
  );
}