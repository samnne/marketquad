import { Stack } from "expo-router";
import "expo-sqlite/localStorage/install";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotificationProvider } from "@/context/NotificationContext";
import { AnimatePresence } from "moti";
import SuccessMessage from "@/components/Modals/SuccessMessage";
import ErrorMessage from "@/components/Modals/ErrorMessage";
import { useMessage } from "@/store/zustand";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import PostHog, { PostHogProvider } from "posthog-react-native";

const posthog = new PostHog(process.env.EXPO_PUBLIC_POSTHOG_KEY!, {
  host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  errorTracking: {
    autocapture: {
      uncaughtExceptions: true,
      unhandledRejections: true,
      console: ["log", "warn", "error"],
    },
  },
});
export default function RootLayout() {
  const { success, error, msg } = useMessage();

  return (
    <ErrorBoundary
      onError={(err, info) => {
        posthog.captureException(err);
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PostHogProvider
          apiKey={process.env.EXPO_PUBLIC_POSTHOG_KEY!}
          options={{
            host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
            errorTracking: {
              autocapture: {
                uncaughtExceptions: true,
                unhandledRejections: true,
                console: ["error", __DEV__ ? "log" : "info", "warn"],
              },
            },
          }}
        >
          <NotificationProvider>
            <AnimatePresence>
              {success && <SuccessMessage message={msg} />}
              {error && <ErrorMessage message={msg} />}
            </AnimatePresence>
            <Stack screenOptions={{ headerShown: false }} />
          </NotificationProvider>
        </PostHogProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
