import AuthProvider, { AuthContext } from './server/context/authContext';
import AppNav from './src/navigation/AppNav';

import { useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Root() {
  const context = useContext(AuthContext);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
      async function fetchToken() {
        const storedToken = await AsyncStorage.getItem('token');

        if (storedToken) {
          let authenticated = await context.authenticate({ token: storedToken });
          if (authenticated)
            console.log('Logged in');
          else
            console.log('Not logged in');
        }
        setIsChecking(false);
      }

    fetchToken();
  }, []);

  return <AppNav />
}

export default App = () => {
  
  return (
    <AuthProvider>
      <Root></Root>
    </AuthProvider>
  );
}