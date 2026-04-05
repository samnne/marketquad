import { View, Image } from "react-native";
import React, { ReactNode } from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tabs } from "@/constants/constants";
import { TabIconProps } from "@/type";
import { StatusBar } from "expo-status-bar";
import { colors, components } from "@/constants/theme";
import { TAB_ORDER } from "@/hooks/useTabDirection";
import { useTabStore } from "@/store/zustand";
import { HapticTab } from "@/components/HapticTab";

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const tabBar = components.tabBar;
  const { setTabIndex } = useTabStore();
  function TabIcon({ focused, icon }: TabIconProps): ReactNode {
    return (
      <View className=" size-14 items-center justify-center">
        <View
          className={` size-14 items-center justify-center rounded-full ${
            focused ? "bg-primary" : "bg-pill"
          }`}
        >
          {icon}
        </View>
        <View>
          <StatusBar style="dark" />
        </View>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: insets.bottom,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor: colors.pill,
          elevation: 0,
          borderTopWidth: 0,
        },
        tabBarButton: (props) => <HapticTab {...props} />,

        tabBarItemStyle: {
          paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame,
          height: tabBar.height,
          alignItems: "center",
        },
      }}
      screenListeners={{
        tabPress: (e) => {
          const route = e.target?.split("-")[0]; // expo-router target format
          const index = TAB_ORDER.findIndex(
            (t) => t === `/${route}` || (route === "index" && t === "/"),
          );
          if (index !== -1) setTabIndex(index);
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabsLayout;
