import React from "react";
import { View, Pressable, StyleSheet, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "./ThemedText";
import { Spacing, BorderRadius } from "../constants/theme";

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.5,
  stiffness: 120,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TabItemProps {
  label: string;
  icon: string;
  isFocused: boolean;
  onPress: () => void;
}

function TabItem({ label, icon, isFocused, onPress }: TabItemProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const content = (
    <>
      <Feather
        name={icon as any}
        size={20}
        color={isFocused ? "#14B8A6" : "rgba(255, 255, 255, 0.5)"}
      />
      {isFocused ? (
        <ThemedText style={styles.tabLabel}>
          {label}
        </ThemedText>
      ) : null}
    </>
  );

  if (Platform.OS === "ios" && isFocused) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.tabItem, animatedStyle]}
      >
        <BlurView
          intensity={40}
          tint="dark"
          style={styles.activeTabBlur}
        >
          <View style={styles.activeTabInner}>
            {content}
          </View>
        </BlurView>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.tabItem,
        isFocused && styles.tabItemActiveFallback,
        animatedStyle,
      ]}
    >
      {content}
    </AnimatedPressable>
  );
}

const TAB_ICONS: Record<string, string> = {
  Feelings: "heart",
  Collections: "folder",
  Favorites: "bookmark",
  Settings: "settings",
};

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={styles.tabsContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={route.key}
            label={label as string}
            icon={TAB_ICONS[route.name] || "circle"}
            isFocused={isFocused}
            onPress={onPress}
          />
        );
      })}
    </View>
  );

  if (Platform.OS === "ios") {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <BlurView
          intensity={60}
          tint="dark"
          style={styles.tabBar}
        >
          <View style={styles.tabBarInner}>
            {content}
          </View>
        </BlurView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + Spacing.sm }]}>
      <View style={styles.tabBarFallback}>
        {content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  tabBar: {
    borderRadius: BorderRadius["3xl"],
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  tabBarInner: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  tabBarFallback: {
    backgroundColor: "rgba(20, 35, 50, 0.95)",
    borderRadius: BorderRadius["3xl"],
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius["2xl"],
    gap: Spacing.sm,
  },
  activeTabBlur: {
    borderRadius: BorderRadius["2xl"],
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(20, 184, 166, 0.3)",
  },
  activeTabInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: "rgba(20, 184, 166, 0.15)",
    gap: Spacing.sm,
  },
  tabItemActiveFallback: {
    backgroundColor: "rgba(20, 184, 166, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(20, 184, 166, 0.3)",
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#14B8A6",
  },
});
