// components/TabScreenWrapper.tsx
import { useTabDirection, TAB_ORDER } from "@/hooks/useTabDirection";
import { useTabStore } from "@/store/zustand";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { usePathname } from "expo-router";

export function TabScreenWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { direction, currentIndex, setTabIndex } = useTabDirection(pathname);
  const translateX = useSharedValue(direction === "right" ? 400 : -400);

  useEffect(() => {
    translateX.value = direction === "right" ? 400 : -400;
    translateX.value = withTiming(0, { duration: 250 });
    setTabIndex(currentIndex);
  }, [pathname]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
});
