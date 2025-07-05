import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: "Home" }} />
      <Drawer.Screen name="profile" />
      <Drawer.Screen name="settings" />
    </Drawer>
  );
}
