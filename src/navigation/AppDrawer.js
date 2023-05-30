import { createDrawerNavigator } from "@react-navigation/drawer";
import AppStack from "./AppStack";

const Drawer = createDrawerNavigator();

export default AppDrawer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={AppStack}></Drawer.Screen>
    </Drawer.Navigator>
  );
};
