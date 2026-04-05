import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { colors } from "@/constants/theme";

const SectionHeader = ({
  title,
  type,
}: {
  title: string;
  type: "listings" | "messages" | "null";
}) => {
  const router = useRouter();

  const handlePress = () => {
    switch (type) {
      case "listings":
        router.push("/listings");
        break;
      case "messages":
        router.push("/(tabs)/convos");
        break;
      default:
        break;
    }
  };

  return (
    <View className="flex-row justify-between items-center gap-2">
      <Text className="text-2xl text-text font-bold">{title}</Text>
      <Pressable
        onPress={handlePress}
        className="p-1 active:opacity-60"
      >
        <FontAwesome
          name="chevron-right"
          size={20}
          color={colors.text}
        />
      </Pressable>
    </View>
  );
};

export default SectionHeader;