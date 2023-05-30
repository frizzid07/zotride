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
    setToken(authToken.token);
    console.log(`In authcontext ${JSON.stringify(authToken)}`);
    try {
      let checkUser = await fetch(NGROK_TUNNEL + "/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({authToken: authToken}),
      });
      console.log(checkUser.ok);
      const userData = await checkUser.json();
      console.log(userData.userData);
      console.log('One more');
      if (userData !== undefined) {
        setUser(userData.userData);
        AsyncStorage.setItem("user", JSON.stringify(userData.userData));
        AsyncStorage.setItem("token", authToken.token);
        return true;
      }
    } catch (error) {
      console.log(`Login Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
    return false;
  }

  function logout() {
    setIsLoading(true);
    try {
      AsyncStorage.removeItem("user");
      AsyncStorage.removeItem("token");
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
