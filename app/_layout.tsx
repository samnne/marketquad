import { Stack } from "expo-router";
import "expo-sqlite/localStorage/install";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotificationProvider } from "@/context/NotificationContext";

export default function RootLayout() {

  return (
    <GestureHandlerRootView>
      <NotificationProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </NotificationProvider>
    </GestureHandlerRootView>
  );
}
