import React, { useState, useEffect } from "react";
import { View, Pressable, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Image as Img } from "expo-image";
import { AVATAR_COLORS, timeAgo } from "@/constants/constants";
import { User } from "@supabase/supabase-js";
import { router } from "expo-router";
import { styled } from "react-native-css";
import { useFocusEffect } from "expo-router";
import { useUnread } from "@/store/zustand";
const Image = styled(Img)
export function ConversationItem({
  convo,
  index,
  user,
  handleDelete,
  setSelectedConvo,
  setConvos,
  convos,
 
}: {
  convo: Conversation,
  index: number,
  user: (ProfileData & User & { app_user: PublicUser & ProfileData; }) | null,
  handleDelete: (cid: string) => void,
  setSelectedConvo: (convo: Conversation)=> void,
  setConvos: (convos: Conversation[]) => void,
  convos: Conversation[],
  

}) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const isSeller = convo?.seller?.uid === user?.id;

  const otherUserName = isSeller ? convo?.buyer?.name : convo?.seller?.name;
  const title = `${otherUserName ?? "Unknown"} • ${convo.listing?.title ?? "Unknown listing"}`;
  const timestamp = convo.updatedAt ?? convo.createdAt;
  const listing = convo.listing;

  // 1. Make lastMsg and unreadCount stateful
  const [lastMsg, setLastMsg] = useState(
    convo.messages?.[convo.messages.length - 1]
  );
  const {unreadCount, setUnreadCount} = useUnread();
  const [urCount, setUrCount] = useState(
    convo.messages?.filter(
      (msg) => msg.readAt === null && msg.senderId !== user?.id
    )?.length ?? 0
  );

  // 2. Keep state in sync if convo.messages updates (e.g. real-time listeners)
  useFocusEffect(() => {
    const msgs = convo.messages || [];
    setLastMsg(msgs[msgs.length - 1]);
    setUrCount(
      msgs.filter((msg) => msg.readAt === null && msg.senderId !== user?.id).length
    );
    
  });

  const handlePress = () => {
    setSelectedConvo(convo);

    // Optimistically clear the unread count in the UI instantly
    setUrCount(0);
    setUnreadCount((unreadCount - urCount) > 0 ?  unreadCount - urCount : 0)
    // Safely update the messages array without mutating the original state directly
    const updatedMessages = convo.messages.map((mssg) => {
      if (mssg.readAt === null && mssg.senderId !== user?.id) {
        return { ...mssg, readAt: Date.now().toString() }; 
      }
      return mssg;
    });
   

    // Safely update the global convos array
    const updatedConvos = convos.map((c) => {
      if (c.cid === convo.cid) {
        return { ...c, messages: updatedMessages };
      }
      return c;
    });

    setConvos(updatedConvos);
    router.push(`/convos/${convo.cid}`);
  };

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(index * 80)}>
      <Pressable
        onLongPress={() => handleDelete(convo.cid)}
        onPress={handlePress}
        className="flex-row items-center gap-3 px-4 py-3.5 active:bg-secondary/10"
      >
        {/* Avatar */}
        <View
          className="w-18 h-18 justify-center items-center rounded-2xl"
          style={{
            backgroundColor: color.bg,
          }}
        >
          <Image
            source={{
              uri: listing?.imageUrls?.length > 0 ? listing?.imageUrls[0] : "#",
            }}
            className="flex-1 w-full rounded-2xl"
            contentFit="cover"
          />
        </View>

        {/* Text */}
        <View className="flex-1 gap-0.5 min-w-0">
          <Text className="text-xl font-semibold text-text" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-[12px] text-secondary/75" numberOfLines={1}>
            {lastMsg?.text ?? "Most recent message"}
          </Text>
        </View>

        {/* Timestamp + unread */}
        <View className="items-end gap-1 shrink-0">
          <Text className="text-[11px] text-secondary/70">
            {timeAgo(timestamp)}
          </Text>
          {urCount > 0 ? (
            <View className="w-5 h-5 bg-primary rounded-full items-center justify-center">
              <Text className="text-[10px] font-bold text-text">
                {urCount}
              </Text>
            </View>
          ) : (
            <Text className="text-[11px] text-secondary/50">Delivered</Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}