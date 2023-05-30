import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from 'react-native';
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import { useContext } from "react";
import { AuthContext } from "../../server/context/authContext";

export default AppNav = () => {
    const { isLoggedIn, isLoading } = useContext(AuthContext);

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