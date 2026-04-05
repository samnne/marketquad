import { View, ScrollView, Image, Pressable, Dimensions } from "react-native";
import { useState, useRef } from "react";
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, interpolate,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAG_BUFFER = 50;

const Carousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const startX     = useSharedValue(0);

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, images.length - 1));
    setCurrentIndex(clamped);
    translateX.value = withSpring(-clamped * SCREEN_WIDTH, {
      stiffness: 300,
      mass: 3,
      damping: 30,
    });
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      startX.value = translateX.value;
    })
    .onUpdate((e) => {
      // follow finger with some resistance at edges
      translateX.value = startX.value + e.translationX * 0.9;
    })
    .onEnd((e) => {
      if (images.length === 1) {
        goTo(currentIndex);
        return;
      }
      if (e.translationX <= -DRAG_BUFFER) {
        goTo(Math.min(currentIndex + 1, images.length - 1));
      } else if (e.translationX >= DRAG_BUFFER) {
        goTo(Math.max(currentIndex - 1, 0));
      } else {
        // snap back
        goTo(currentIndex);
      }
    })
    .runOnJS(true);

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (!images?.length) return null;

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 overflow-hidden">

        {/* ── Image strip ── */}
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              stripStyle,
              { flexDirection: "row", width: SCREEN_WIDTH * images.length, height: "100%" },
            ]}
          >
            {images.map((uri, i) => (
              <SlideItem
                key={uri + i}
                uri={uri}
                index={i}
                currentIndex={currentIndex}
              />
            ))}
          </Animated.View>
        </GestureDetector>

        {/* ── Dot indicators ── */}
        {images.length > 1 && (
          <View
            className="absolute bottom-3 self-center flex-row gap-2 bg-black/25 rounded-full px-4 py-2"
          >
            {images.map((_, i) => (
              <Pressable
                key={i}
                onPress={() => goTo(i)}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: i === currentIndex ? colors.primary : "#6b7280",
                }}
              />
            ))}
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

// ── Individual slide with scale animation ────────────────────────────────────
const SlideItem = ({
  uri, index, currentIndex,
}: {
  uri: string;
  index: number;
  currentIndex: number;
}) => {
  const scale = useSharedValue(index === currentIndex ? 0.95 : 0.85);

  // update scale when currentIndex changes
  scale.value = withSpring(index === currentIndex ? 0.95 : 0.85, {
    stiffness: 300,
    mass: 3,
    damping: 30,
  });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[animStyle, { width: SCREEN_WIDTH, height: "100%" }]}
    >
      <Image
        source={{ uri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

export default Carousel;