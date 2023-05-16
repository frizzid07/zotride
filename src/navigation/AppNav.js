import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from 'react-native';
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../server/context/authContext";

// import { useAsyncStorage } from "@react-native-async-storage/async-storage";

export default AppNav = () => {
    const { isLoggedIn, isLoading } = useContext(AuthContext);

    // const {getItem} = useAsyncStorage('@token');
    // const [isChecking, setIsChecking] = useState(true);

    // useEffect(() => {
    //     const checkUserLogin = async() => {
    //         const token = await getItem();
    //         if(token) {
    //             setIsLoggedIn(true);
    //         }
    //         setIsChecking(false);
    //     }

    //     checkUserLogin();
    // }, []);

    if(isLoading) {
        return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={'large'}/>
        </View>
        );
    }
    
    return (
        <NavigationContainer>
            {isLoggedIn ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}