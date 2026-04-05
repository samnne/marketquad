import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useConvos, useListings, useUser } from "@/store/zustand";
import { colors } from "@/constants/theme";
import UserListings from "./UserListings";

const ProfileSections = ({
  displayText,
  sideIcon,
  props,
  badge,
  badgeAccent,
}: {
  displayText: string;
  sideIcon: React.ReactNode;
  props?: { type?: string };
  badge?: number;
  badgeAccent?: boolean;
}) => {
  const router = useRouter();
  const { setSelectedListing } = useListings();
  const { userListings } = useUser();
  const { convos } = useConvos();
  const modalType = props?.type;
  const [showUserListings, setShowUserListings] = useState(false);

  const subtext =
    modalType === "ulist"
      ? `${userListings.length} active`
      : modalType === "messages"
        ? `${convos?.length ?? 0} total`
        : "";

  const badgeValue =
    modalType === "ulist"
      ? userListings.length
      : modalType === "messages"
        ? (convos?.length ?? 0)
        : badge;

  const handlePress = () => {
    switch (modalType) {
      case "ulist":
        setSelectedListing({});
        setShowUserListings(true);
        break;
      case "messages":
        router.push("/(tabs)/convos");
        break;
      case "prefs":
        router.push("/prefs/prefs");
      default:
        break;
    }
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        className="flex-row justify-between items-center border-b border-primary/15 active:bg-primary/10"
      >
        {/* Left — icon + text */}
        <View className="flex-row items-center gap-2 p-4">
          <View className="bg-primary/20 p-2 rounded-lg">{sideIcon}</View>
          <View>
            <Text className="text-[14px] font-medium text-text">
              {displayText}
            </Text>
            {subtext ? (
              <Text className="text-xs text-primary">{subtext}</Text>
            ) : null}
          </View>
        </View>

        {/* Right — badge + chevron */}
        <View className="flex-row items-center gap-2 pr-4">
          {badgeValue !== undefined && badgeValue > 0 && (
            <View
              className={`px-3 py-1 rounded-2xl ${
                badgeAccent ? "bg-primary" : "bg-text"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  badgeAccent ? "text-pill" : "text-primary"
                }`}
              >
                {badgeValue}
              </Text>
            </View>
          )}
          <FontAwesome name="chevron-right" size={12} color={colors.primary} />
        </View>
      </Pressable>
      {showUserListings && (
        <UserListings
          showModal={showUserListings}
          setModals={() => setShowUserListings(false)}
        />
      )}
      {/* User listings modal */}
    </>
  );
};

export default ProfileSections;
