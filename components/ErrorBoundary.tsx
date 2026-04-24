
import {  type ReactNode } from "react";
import { ErrorBoundary as REB, useErrorBoundary as useREB } from "react-error-boundary";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import React from "react";

// ─── Re-export the hook under the same name ───────────────────────────────────
export const useErrorBoundary = useREB;

// ─── Props ────────────────────────────────────────────────────────────────────
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: unknown, reset: () => void) => ReactNode;
  onError?: (error: unknown, info: React.ErrorInfo) => void;
}

// ─── Public component ─────────────────────────────────────────────────────────
export const ErrorBoundary = ({ children, fallback, onError }: ErrorBoundaryProps) => (
  <REB
    onError={onError!}
    fallbackRender={({ error, resetErrorBoundary }) =>
      fallback
        ? fallback(error, resetErrorBoundary)
        : <ErrorFallback error={error} onReset={resetErrorBoundary} />
    }
  >
    {children}
  </REB>
);

// ─── Animated fallback UI ─────────────────────────────────────────────────────
const ErrorFallback = ({ error, onReset }: { error: unknown | Error; onReset: () => void }) => {
  const shake = useSharedValue(0);
  const fadeIn = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  React.useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 400 });
    shake.value = withSequence(
      withTiming(-8, { duration: 60 }),
      withRepeat(
        withSequence(
          withTiming(8, { duration: 80 }),
          withTiming(-8, { duration: 80 }),
        ),
        3,
        true,
      ),
      withTiming(0, { duration: 60 }),
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: (1 - fadeIn.value) * 20 }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.View style={[styles.iconWrap, iconStyle]}>
          <Text style={styles.icon}>⚠</Text>
        </Animated.View>

        <Text style={styles.heading}>Something went wrong</Text>
        <Text style={styles.subheading}>The app ran into an unexpected error.</Text>

        {__DEV__ && (
          <ScrollView
            style={styles.errorBox}
            contentContainerStyle={styles.errorBoxContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.errorName}>{error.name}</Text>
            <Text style={styles.errorMessage}>{error.message}</Text>
          </ScrollView>
        )}

        <Animated.View style={btnStyle}>
          <Pressable
            style={styles.button}
            onPressIn={() => { buttonScale.value = withSpring(0.94, { stiffness: 400 }); }}
            onPressOut={() => { buttonScale.value = withSpring(1, { stiffness: 400 }); }}
            onPress={onReset}
          >
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FAFAF8", alignItems: "center", justifyContent: "center", padding: 24 },
  container: { width: "100%", maxWidth: 360, alignItems: "center", gap: 12 },
  iconWrap: { width: 72, height: 72, borderRadius: 20, backgroundColor: "#FFF3CD", alignItems: "center", justifyContent: "center", marginBottom: 4, borderWidth: 1.5, borderColor: "#FBBF24" },
  icon: { fontSize: 32 },
  heading: { fontSize: 22, fontWeight: "700", color: "#1A1A1A", textAlign: "center", letterSpacing: -0.4 },
  subheading: { fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 20 },
  errorBox: { width: "100%", maxHeight: 140, backgroundColor: "#F3F4F6", borderRadius: 12, marginTop: 8, borderWidth: 1, borderColor: "#E5E7EB" },
  errorBoxContent: { padding: 14, gap: 4 },
  errorName: { fontSize: 11, fontWeight: "700", color: "#EF4444", textTransform: "uppercase", letterSpacing: 0.6 },
  errorMessage: { fontSize: 12, color: "#374151", fontFamily: "monospace", lineHeight: 18 },
  button: { marginTop: 8, backgroundColor: "#1A1A1A", paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14, minWidth: 160, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15, letterSpacing: -0.2 },
});