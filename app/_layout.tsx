import "expo-sqlite/localStorage/install";
import { Stack } from "expo-router";
import "../global.css";
import { useEffect } from "react";
import { usePrefs } from "@/store/zustand";

export default function RootLayout() {
  const { loadPrefs } = usePrefs();

  useEffect(() => {
    loadPrefs(); // ← prefs available globally from first render
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
