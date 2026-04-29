import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@/store/zustand";
import { MotiText } from "moti";

export default function CustomHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();
  return (
    <View
      className="bg-pill border-b border-background flex-row items-center justify-between px-4 pb-3"
      style={{ paddingTop: insets.top + 10 }}
    >
      <Pressable onPress={() => router.replace("/home")} className="flex-1">
        <MotiText // Initial state
          from={{ opacity: 1, translateY: 0 }}
          // State when in view
          animate={{ opacity: 1, translateY: 0 }}
          // Viewport options
          
          // viewport={{ once: true, amount: 0.5 }}
          className="text-4xl text-primary font-black  tracking-tighter"
        >
          Market<Text className="text-secondary">Quad</Text>
        </MotiText>
      </Pressable>

      <View className="flex-row gap-4">
        <Pressable onPress={() => router.push("/favs")}>
          <Ionicons name="bookmark-outline" size={22} color="#1a2e28" />
        </Pressable>
        <Pressable onPress={() => router.push(`/settings/${user?.id}`)}>
          <Ionicons name="settings-outline" size={22} color="#1a2e28" />
        </Pressable>
      </View>
    </View>
  );
}
