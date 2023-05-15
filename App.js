import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import Welcome from "./src/screens/Welcome";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Verify from "./src/screens/Verify";
import Landing from "./src/screens/Landing";
import Driver from "./src/screens/Driver";
import Passenger from "./src/screens/Passenger";
import DriverRegistration from "./src/screens/DriverRegistration";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Verify"
          component={Verify}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Landing"
          component={Landing}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DriverRegistration"
          component={DriverRegistration}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Driver"
          component={Driver}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Passenger"
          component={Passenger}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
