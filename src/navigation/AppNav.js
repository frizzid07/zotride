import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import BottomTab from "./BottomTab";
import { useContext } from "react";
import { AuthContext } from "../../server/context/authContext";
import { useCallback } from "react";

import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

export default AppNav = () => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size={"large"} />
  //     </View>
  //   );
  // }

  const onLayoutRootView = useCallback(async () => {
    if (!isLoading) {
      console.log("Closing Splash Screen");
      await SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <View style={{ width: "100%", height: "100%" }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        {isLoggedIn ? <BottomTab /> : <AuthStack />}
      </NavigationContainer>
    </View>
  );
};
