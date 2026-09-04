
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { PlatformPressable } from 'expo-router/build/react-navigation';
import { BottomTabBarButtonProps } from 'expo-router/build/react-navigation/bottom-tabs';
export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
     
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
