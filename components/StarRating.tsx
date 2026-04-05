import { View, Pressable } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const STAR_PATH = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Star = ({
  index,
  filled,
  onPress,
}: {
  index: number;
  filled: boolean;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={style}
      onPressIn={() => { scale.value = withSpring(0.75, { stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1,    { stiffness: 400 }); }}
      onPress={onPress}
    >
      <Svg width={20} height={20} viewBox="0 0 20 20">
        <Path
          d={STAR_PATH}
          fill={filled ? "#facc15" : "rgba(209,213,219,0.5)"}
        />
      </Svg>
    </AnimatedPressable>
  );
};

export default function StarRating({
  value,
  setValue,
}: {
  value: number;
  setValue: Function;
}) {
  return (
    <View className="flex-row gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          index={star}
          filled={star <= value}
          onPress={() => setValue(star)}
        />
      ))}
    </View>
  );
}