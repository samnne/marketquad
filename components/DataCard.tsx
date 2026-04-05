import { useRef } from "react";
import { ScrollView, View, Text, Image, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

interface Listing {
  lid?: string;
  title?: string;
  price?: number;
  condition?: string;
  imageUrls?: string[];
  seller?: { email: string };
}

interface Conversation {
  cid?: string;
  conversationId?: string;
  listing?: { title: string };
}

interface DataCardProps {
  dataList: Listing[] | Conversation[] | any[];
  href: "listings" | "convos";
}

const DataCard = ({ dataList, href }: DataCardProps) => {
  const router = useRouter();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 py-2"
    >
      {dataList?.map((data: Listing & Conversation, i) => {
        const key = data?.lid ?? data?.conversationId ?? data?.cid ?? i;
        const id = data?.lid ?? data?.cid;

        return (
          <Animated.View
            key={key}
            entering={FadeInDown.duration(400).delay(i * 100)}
          >
            <Pressable
              onPress={() =>
                router.push(href === "convos" ? `/${href}/${id}` : `/${href}`)
              }
              className="relative flex-col rounded-2xl shadow-sm shadow-black/20 min-w-50 overflow-hidden bg-pill"
            >
              {/* Image */}
              {data?.imageUrls?.length > 0 ? (
                <Image
                  source={{ uri: data.imageUrls[0] }}
                  className="w-full h-44 rounded-t-2xl"
                  resizeMode="cover"
                />
              ) : null}

              {/* Info */}
              <View className="p-2 bg-pill rounded-b-2xl gap-0.5">
                <Text className="font-bold text-text text-sm" numberOfLines={1}>
                  {data?.title ?? data?.listing?.title}
                </Text>

                <Text className="text-xs text-secondary" numberOfLines={1}>
                  {data?.seller?.email.substring(
                    0,
                    data?.seller?.email.indexOf("@"),
                  )}
                </Text>

                <Text className="font-bold text-base text-text">
                  {data?.price === 0
                    ? "Free"
                    : data?.price
                      ? `$${data.price}`
                      : ""}
                </Text>
              </View>

              {/* Condition badge */}
              {data?.condition && (
                <View className="will-change-variable absolute top-2 right-2 bg-pill border  border-primary rounded-2xl px-2 py-0.5">
                  <Text className="text-xs text-secondary font-bold">
                    {data.condition}
                  </Text>
                </View>
              )}
            </Pressable>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
};

export default DataCard;
