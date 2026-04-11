import { View, Text, Image, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useListings } from "@/store/zustand";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ListingCard = ({ listing }: { listing: any }) => {
  const { setSelectedListing } = useListings();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={animatedStyle}
      onPressIn={() => {
        scale.value = withSpring(0.95, { stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { stiffness: 400 });
      }}
      onPress={() => setSelectedListing(listing)}
      className="bg-pill rounded-3xl overflow-hidden  shadow-lg shadow-black/20 flex-col"
    >
      {/* ── Image ── */}
      <View className="h-48 bg-primary/25 items-center justify-center">
        {listing.imageUrls?.[0] ? (
          <Image
            source={{ uri: listing.imageUrls[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          // Placeholder
          <Text className="text-4xl opacity-30">🛒</Text>
        )}

        {/* Sold / Archived badge */}
        {(listing.sold || listing.archived) && (
          <View
            className={`absolute top-3 right-3 px-2 py-0.5 rounded-lg border ${
              listing.sold
                ? "bg-red-300 border-red-300"
                : "bg-text border-primary"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                listing.sold ? "text-red-500" : "text-primary"
              }`}
            >
              {listing.sold ? "SOLD" : "ARCHIVED"}
            </Text>
          </View>
        )}
      </View>

      {/* ── Info ── */}
      <View className="p-4 gap-1">
        <Text className="text-base font-bold text-text" numberOfLines={1}>
          {listing.price != "0" ? `$${listing.price}` : "FREE"} ·{" "}
          {listing.title}
        </Text>

        <Text className="text-sm font-bold text-accent/50">
          {listing.condition}
        </Text>

        <Text className="text-sm text-secondary truncate" numberOfLines={2}>
          {listing.description}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

export default ListingCard;

