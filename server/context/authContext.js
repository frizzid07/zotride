import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, createContext, useEffect } from "react";

import { NGROK_TUNNEL } from "@env";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState();
  const [user, setUser] = useState();

  async function authenticate(authToken) {
    setIsLoading(true);
    setIsLoggedIn(true);
    setToken(authToken);
    console.log(`In authcontext ${JSON.stringify(authToken)}`);
    try {
      let checkUser = await fetch(NGROK_TUNNEL + "/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({authToken: authToken}),
      });
      const userData = await checkUser.json();
      console.log(userData);
      console.log('In context');
      if (userData !== undefined) {
        setUser(userData.userData);
        await AsyncStorage.setItem("user", JSON.stringify(userData.userData));
        return true;
      }
    } catch (error) {
      console.log(`Login Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
    return false;
  }

  async function logout() {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("user");
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      if (token) {
        await AsyncStorage.removeItem("token");
      }
      setIsLoggedIn(false);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.log(`Logout Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  const value = {
    token: token,
    user: user,
    isLoggedIn: isLoggedIn,
    isLoading: isLoading,
    authenticate: authenticate,
    setIsLoggedIn: setIsLoggedIn,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
