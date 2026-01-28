import React from "react";
import { StyleSheet, Pressable, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { DisplayOption } from "@/types";

interface DisplayOptionChipProps {
  option: DisplayOption;
  label: string;
  isActive: boolean;
  onToggle: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DisplayOptionChip({
  option,
  label,
  isActive,
  onToggle,
}: DisplayOptionChipProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  if (isActive) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.chip, styles.activeChip, { backgroundColor: theme.primary }, animatedStyle]}
        testID={`display-chip-${option}`}
      >
        <ThemedText style={[styles.label, { color: "#FFFFFF" }]}>{label}</ThemedText>
      </AnimatedPressable>
    );
  }

  if (Platform.OS === "ios") {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.chip, animatedStyle]}
        testID={`display-chip-${option}`}
      >
        <BlurView intensity={40} tint="dark" style={[styles.blurContent, { borderColor: theme.border }]}>
          <ThemedText style={[styles.label, { color: "rgba(255,255,255,0.7)" }]}>{label}</ThemedText>
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
        styles.chip,
        styles.fallback,
        { backgroundColor: theme.cardGlass, borderColor: theme.border },
        animatedStyle,
      ]}
      testID={`display-chip-${option}`}
    >
      <ThemedText style={[styles.label, { color: "rgba(255,255,255,0.7)" }]}>{label}</ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  activeChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  blurContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  fallback: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
});
