import { useMessage } from "@/store/zustand";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type ErrorMessageProps = {
  message?: string;
  onClose: () => void;
};

const ErrorMessage = ({
  message = "An error occurred",
  onClose,
}: ErrorMessageProps) => {
  const { setError } = useMessage();
  return (
    <View className="absolute bottom-10 left-0 right-0 z-50 px-4">
      <View className="flex-row items-center justify-between bg-white border-2 border-red-500 rounded-2xl p-4 shadow-lg shadow-red-500/30">
        <View className="flex-row items-center gap-2 flex-1">
          <Text className="text-red-500 text-lg">
            <MaterialIcons name="error-outline" size={24} color="red" />
          </Text>
          <Text className="text-red-500 text-base font-semibold shrink">
            {message}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setError(false)}
          activeOpacity={0.7}
          className="ml-3 bg-red-500 rounded-xl px-4 py-2"
        >
          <Text className="text-white font-semibold ">
            <AntDesign name="close-circle" size={24} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ErrorMessage;
