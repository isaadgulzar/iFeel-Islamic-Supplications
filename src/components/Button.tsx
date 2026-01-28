import React from "react";
import { StyleSheet, Pressable, ViewStyle, TextStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius } from "../constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.96);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const getButtonStyle = () => {
    if (variant === "primary") {
      return { backgroundColor: theme.primary };
    }
    if (variant === "secondary") {
      return { backgroundColor: theme.backgroundSecondary };
    }
    return {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.border,
    };
  };

  const getTextColor = () => {
    if (variant === "outline") {
      return theme.text;
    }
    return theme.buttonText;
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      disabled={disabled}
    >
      <ThemedText
        style={[
          styles.text,
          { color: getTextColor() },
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Spacing.buttonHeight,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});
