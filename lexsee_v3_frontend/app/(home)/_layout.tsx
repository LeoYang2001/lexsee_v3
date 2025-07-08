
import { Drawer } from "expo-router/drawer";
import { Dimensions } from "react-native";

export default function MainLayout() {
  const screenWidth = Dimensions.get("screen").width;
  const drawerWidth = screenWidth * 0.7;
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        drawerStyle: {
          width: drawerWidth, // Set the width to 70% of the screen
        },
        drawerType: "front",
      }}
    >
      <Drawer.Screen name="index" options={{ title: "Home" }} />
    </Drawer>
  );
}
