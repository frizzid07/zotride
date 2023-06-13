import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileLanding from "../screens/ProfileLanding";
import PastRides from "../screens/PastRides";

const Stack = createNativeStackNavigator();

export default ProfileStack = () =>{
    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileLanding" component={ProfileLanding} />
            <Stack.Screen name="PastRides" component={PastRides} />
        </Stack.Navigator>
    )
}