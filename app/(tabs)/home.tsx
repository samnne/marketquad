import ListingCard from "@/components/Listings/ListingCard";
import CategoryChips from "@/components/Utils/CategoryChips";

import { colors, components } from "@/constants/theme";
import { db } from "@/db/db";
import { useRefresh } from "@/hooks/useRefresh";
import { useConvos, useListings, useMessage, useUser } from "@/store/zustand";
import { fetchConvos, fetchListings, getUserSupabase } from "@/utils/functions";
import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  Image,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Sections & Stories ───────────────────────────────────────────────────────
const SectionTitle = ({
  label,
  onSeeAll,
}: {
  label: string;
  onSeeAll?: () => void;
}) => (
  <View className="flex-row items-center justify-between px-4 pt-5 pb-2.5">
    <Text className="text-text text-3xl font-extrabold tracking-tight uppercase">
      {label}
    </Text>
    {onSeeAll && (
      <Pressable onPress={onSeeAll}>
        <Text className="text-accent text-lg font-semibold">See all</Text>
      </Pressable>
    )}
  </View>
);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ── HomeScreen ─────────────────────────────────────────────────────────────
function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { listings, setListings } = useListings();
  const { convos, setConvos } = useConvos();
  const { setSuccess } = useMessage();
  const { refreshing, onRefresh } = useRefresh({
    func: async () => {
      await fetchListings({ setter: setListings });
      await fetchConvos({ setter: setConvos });
    },
  });
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { user, setUser } = useUser();
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const mount = async () => {
      const { user, app_user } = await getUserSupabase();
      if (!user) router.navigate("/(auth)/sign-in");
      setUser({ ...user, app_user });
    };
    mount();
  }, [router, setUser]);

  useEffect(() => {
    const mount = async () => {
      await fetchListings({ setter: setListings });
      await fetchConvos({ setter: setConvos });
    };

    mount();
  }, [setListings]);
  const active = useMemo(
    () => (listings ?? []).filter((l) => !l.sold && !l.archived),
    [listings],
  );

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? active
        : active.filter((l) => l.category === activeCategory),
    [active, activeCategory],
  );

  const hot = useMemo(
    () =>
      [...(active ?? [])]
        .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
        .slice(0, 8),
    [active],
  );

  const forYou = useMemo(
    () => [...(active ?? [])].sort(() => 0.5 - Math.random()).slice(0, 10),
    [active],
  );
  const isFiltered = activeCategory !== "All";

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + components.tabBar.height,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3db88a"
          />
        }
      >
        {/* ── Search ── */}
        <View
          className={`mx-4 mb-4 mt-4 flex-row items-center bg-pill shadow-sm rounded-xl border px-3 py-3 gap-2 ${focused ? "border-primary" : "border-background"}`}
        >
          <Ionicons name="search-outline" size={16} color="#1a2e2866" />
          <TextInput
            onSubmitEditing={() => {
              router.push(`/listings?search=${searchQuery}`);
            }}
            className="flex-1 text-2xl text-text font-medium"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search textbooks, gear..."
            placeholderTextColor="#1a2e2844"
          />
        </View>

        {/* ── Categories & Toggle ── */}
        <CategoryChips {...{ activeCategory, setActiveCategory }} />

        {/* ── Feed ── */}

        {isFiltered ? (
          <View className="mt-2">
            {filtered.length === 0 ? (
              <View className="p-12 items-center gap-3">
                <Text className="text-3xl">🏷️</Text>
                <Text className="text-text/40 text-sm italic">
                  Nothing found in {activeCategory}
                </Text>
              </View>
            ) : (
              filtered?.map((l) => (
                <ListingCard key={`fewfwfwe${l.lid}uvu`} listing={l} />
              ))
            )}
          </View>
        ) : (
          <>
            <SectionTitle
              label="New On Campus"
              onSeeAll={() => router.push("/listings?sort=views")}
            />
            <View className=" flex-row flex-wrap gap-3 px-1">
              {hot.length > 0 ? (
                hot.map((l) => (
                  <View key={`fbolsnba${l.lid}uvu`} className="w-[48%]">
                    <ListingCard listing={l} />
                  </View>
                ))
              ) : (
                <View className="mx-4 my-2 py-10 items-center gap-2 bg-pill rounded-2xl border border-secondary/10">
                  <Text className="text-2xl"></Text>
                  <Text className="text-text font-semibold text-sm">
                    Nothing trending yet
                  </Text>
                  <Text className="text-secondary text-xs text-center px-8">
                    Be the first to post, your listing could be here.
                  </Text>
                </View>
              )}
            </View>
            <SectionTitle
              label="Jump Back In"
              onSeeAll={() => router.push("/convos")}
            />

            <View className=" flex-row flex-wrap gap-3 px-1">
              {convos?.length === 0 ? (
                <View className="mx-4 my-2 py-10 items-center gap-2 bg-pill rounded-2xl border border-secondary/10 w-full">
                  <SymbolView name="bubble" size={40} tintColor={colors.primary} />
                  <Text className="text-text font-semibold text-sm text-center">
                    Send a message to get started
                  </Text>
                </View>
              ) : (
                convos?.map((convo) => {
                  return (
                    <AnimatedPressable
                      onPress={() => router.push(`/convos/${convo?.cid}`)}
                      key={convo?.cid + "9384y237hufir"}
                      style={animatedStyle}
                      onPressIn={() => {
                        scale.value = withSpring(0.94, { stiffness: 400 });
                      }}
                      onPressOut={() => {
                        scale.value = withSpring(1, { stiffness: 400 });
                      }}
                      className="w-50 h-50 p-2 gap-2  items-center"
                    >
                      <View className="bg-white h-25 w-25 justify-center items-center rounded-full ">
                       {convo.listing?.imageUrls?.[0] ? 
                       
                       <Image
                         source={{ uri: convo.listing?.imageUrls?.[0] }}
                         className="rounded-full w-full h-full"
                       /> : <View className="w-full h-full rounded-full bg-primary "></View>
                      }
                      </View>
                      <View>
                        <Text className="capitalize text-center font-bold">
                          {convo?.listing?.title ?? "Deleted Listing"}
                          {" - "}
                          {convo?.buyerId === (user?.id || user?.app_user?.uid)
                            ? convo.seller.name
                            : convo.buyer.name}
                        </Text>
                        <Text className="text-text/40 text-sm line-clamp-1 truncate ">
                          {convo.messages[convo.messages.length - 1].text}
                        </Text>
                      </View>
                    </AnimatedPressable>
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
export default function Home() {
  return <HomeScreen />;
}
