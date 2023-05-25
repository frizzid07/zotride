import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Verify from '../screens/Verify';

const Stack = createNativeStackNavigator();

export default AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='Welcome' component={Welcome} />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Register' component={Register} />
      <Stack.Screen name='Verify' component={Verify} />
    </Stack.Navigator>
  );
}