import { Stack } from "expo-router";
import "expo-sqlite/localStorage/install";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotificationProvider } from "@/context/NotificationContext";
import { AnimatePresence } from "moti";
import SuccessMessage from "@/components/Modals/SuccessMessage";
import ErrorMessage from "@/components/Modals/ErrorMessage";
import { useMessage } from "@/store/zustand";

export default function RootLayout() {
  const {success, error, msg} = useMessage()
  return (
    <GestureHandlerRootView>
      <NotificationProvider>
           <AnimatePresence>
        {success && <SuccessMessage message={msg} />}
        {error && <ErrorMessage message={msg} />}
      </AnimatePresence>
        <Stack screenOptions={{ headerShown: false }} />
      </NotificationProvider>
    </GestureHandlerRootView>
  );
}
