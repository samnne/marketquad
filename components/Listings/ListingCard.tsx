import { db } from "@/db/db";
import { useLike } from "@/hooks/useLike";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";

import { colors } from "@/constants/theme";
import { useUser } from "@/store/zustand";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: W } = Dimensions.get("window");
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ListingCard = ({ listing }: { listing: Listing }) => {
  const router = useRouter();
  const { user } = useUser();
  const expression = user?.app_user?.likes?.find(
    (l) => l.listingId === listing?.lid,
  );
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  const { count, liked, loading, toggle } = useLike(
    listing?.lid,
    expression,
    listing._count?.likes,
  );

  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const prev = JSON.parse(db.getItem("SAVED_LISTINGS") ?? "[]");
    const isFavourite = (prev as []).find(
      (li: Listing) => li.lid === listing.lid,
    );
    setIsFav(!!isFavourite);
  }, [listing.lid]);

  return (
    <View className=" bg-white rounded-4xl ">
      <View className=" p-3 h-75">
        <AnimatedPressable
          style={animatedStyle}
          className="w-full flex-1"
          onPressIn={() => {
            scale.value = withSpring(0.94, { stiffness: 400 });
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { stiffness: 400 });
          }}
          onPress={() => router.push(`/listings/${listing?.lid}`)}
        >
          {listing.imageUrls?.[0] ? (
            <Image
              source={{ uri: listing.imageUrls[0] }}
              className="w-full flex-1 rounded-4xl "
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center  rounded-t-lg justify-center">
              <Ionicons name="image-outline" size={48} color="#1a2e2811" />
            </View>
          )}
          {listing.archived ||
            (listing.sold && (
              <View className="absolute top-2 bg-primary rounded-full p-2 right-2">
                <Text className="font-bold text-white">
                  {listing.archived ? "Archived" : listing.sold ? "Sold" : ""}
                </Text>
              </View>
            ))}
          <Pressable
            onPress={toggle}
            disabled={loading}
            hitSlop={30}
            className="flex-row gap-2 bg-background rounded-full px-3 py-1 items-center absolute top-3 right-3"
          >
            {typeof count === "number" ? (
              <Text
                className="text-xl font-light text-center"
                style={{ color: liked ? colors.primary : colors.text }}
              >
                {count}
              </Text>
            ) : null}
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              color={liked ? colors.primary : colors.text}
              size={25}
            />
          </Pressable>
        </AnimatedPressable>
        <View className=" items-center gap-4 justify-between  pt-2 flex-row">
          <View className="flex-row gap-2 ">
            <Text className="text-lg font-base">${listing?.price} •</Text>
            <Text className="text-lg font-light w-6/10 line-clamp-1 truncate">
              {listing?.title}
            </Text>
          </View>
        </View>
        <View className="flex-row  pl-1 gap-2 ">
          <Text className="text-base text-text/50 font-light w-40 line-clamp-1 truncate">
            {listing?.description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ListingCard;
