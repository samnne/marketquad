import { colors } from "@/constants/theme";
import { Field, SaveButton } from "@/components/Onboarding";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { supabase } from "@/supabase/supabase";
import { useMessage } from "@/store/zustand";

type Props = {
  open: boolean;
  email: string;
  save: (newPassword: string) => void;
  loading: boolean;
  onDeleteAccount: () => void;
};

export default function AccountSection(props: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const {setError, setMessage, setSuccess} = useMessage()
  if (!props.open) return null;
  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(
      props.email,
      {
        redirectTo: `${process.env.EXPO_PUBLIC_BASE_URL}/update-password`,
      },
    );
    if (error) {
      setError(true);
      setMessage("Failed to send password reset email.");
    } else {
      setSuccess(true);
      setMessage("Password reset email sent, sometimes it takes about 60s.");
    }
  };
  return (
    <Animated.View
      entering={FadeInDown.springify().damping(100)}
      className="px-4 pb-4 gap-4 border-t border-secondary/10"
    >
      <View className="h-3" />

      {/* Email — read only */}
      <Field label="Email">
        <View className="h-12 px-4 border border-secondary/10 rounded-xl bg-secondary/5 justify-center flex-row items-center gap-2">
          <Text className="text-sm text-secondary flex-1" numberOfLines={1}>
            {props.email}
          </Text>
          <FontAwesome6 name="lock" size={11} color={colors.secondary + "80"} />
        </View>
      </Field>

      {/* New password */}
      <View>
        <Text className="text-sm font-semibold tracking-widest uppercase text-text">
          Reset Password?
        </Text>
      </View>

      <SaveButton type="reset-password" onPress={handleForgotPassword} loading={props.loading}  />

      {/* Danger zone */}
      <View className="flex-row items-center gap-3 my-1">
        <View className="flex-1 h-px bg-secondary/10" />
        <Text className="text-xs text-secondary/40">Danger zone</Text>
        <View className="flex-1 h-px bg-secondary/10" />
      </View>

      <Pressable
        onPress={props.onDeleteAccount}
        className="h-11 border border-red-400/40 rounded-xl items-center justify-center"
      >
        <Text className="text-sm font-semibold text-red-400">
          Delete account
        </Text>
      </Pressable>
    </Animated.View>
  );
}
