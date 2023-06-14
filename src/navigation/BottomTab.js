import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AppStack from "./AppStack";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { AuthContext } from "../../server/context/authContext";
import { useContext } from "react";

import Driver from "../screens/Driver";
import FindRide from "../screens/FindRide";
import PastRides from "../screens/PastRides";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();

export default MyTabs = () => {
  const context = useContext(AuthContext);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: "#ebd25f",
        tabBarInactiveTintColor: "white",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home-sharp" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person-sharp" : "person-outline";
          } else if (route.name === "Driver") {
            iconName = focused ? "car-sport-sharp" : "car-sport-outline";
          }
          return (
            <Ionicons name={iconName} size={size} color={color}></Ionicons>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={AppStack}></Tab.Screen>
      {context.user.isDriver && (
        <Tab.Screen name="Driver" component={Driver}></Tab.Screen>
      )}
      <Tab.Screen name="Profile" component={ProfileStack}></Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 50,
    paddingHorizontal: 5,
    paddingTop: 0,
    backgroundColor: "#004aac",
    position: "absolute",
    borderTopWidth: 0,
  },
});
