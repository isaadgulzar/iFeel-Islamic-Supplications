import React, { useRef } from "react";
import { View, Pressable, StyleSheet, Platform, Animated } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius } from "../constants/theme";

const springConfig = {
  damping: 15,
  mass: 0.5,
  stiffness: 120,
  useNativeDriver: true,
};

interface TabItemProps {
  label: string;
  icon: string;
  isFocused: boolean;
  onPress: () => void;
}

function TabItem({ label, icon, isFocused, onPress }: TabItemProps) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const animatedStyle = {
    transform: [{ scale }],
  };

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      ...springConfig,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      ...springConfig,
    }).start();
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
        color={isFocused ? theme.tabIconSelected : theme.tabIconDefault}
      />
      <ThemedText style={[
        styles.tabLabel,
        { color: isFocused ? theme.tabIconSelected : theme.tabIconDefault },
        isFocused && { fontWeight: "600" }
      ]}>
        {label}
      </ThemedText>
    </>
  );

  if (Platform.OS === "ios" && isFocused) {
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.tabItem, animatedStyle]}>
          <BlurView
            intensity={40}
            tint="dark"
            style={[styles.activeTabBlur, { borderColor: `${theme.tabIconSelected}4D` }]}
          >
            <View style={[styles.activeTabInner, { backgroundColor: theme.tabBarActive }]}>
              {content}
            </View>
          </BlurView>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[
        styles.tabItem,
        isFocused && [styles.tabItemActiveFallback, {
          backgroundColor: theme.tabBarActive,
          borderColor: `${theme.tabIconSelected}4D`
        }],
        animatedStyle,
      ]}>
        {content}
      </Animated.View>
    </Pressable>
  );
}

const TAB_ICONS: Record<string, string> = {
  Feelings: "heart",
  Collections: "folder",
  Favorites: "bookmark",
  Settings: "settings",
};

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
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
          style={[styles.tabBar, { borderColor: theme.border }]}
        >
          <View style={[styles.tabBarInner, { backgroundColor: theme.backgroundDefault }]}>
            {content}
          </View>
        </BlurView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + Spacing.sm }]}>
      <View style={[styles.tabBarFallback, {
        backgroundColor: theme.tabBarBg,
        borderColor: theme.border
      }]}>
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
    paddingHorizontal: Spacing.xs,
  },
  tabBar: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
  },
  tabBarInner: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  tabBarFallback: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  tabItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: 2,
    flex: 1,
  },
  activeTabBlur: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
  },
  activeTabInner: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    gap: 2,
  },
  tabItemActiveFallback: {
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 10,
  },
});
