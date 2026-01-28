import React from "react";
import { StyleSheet, Pressable, View, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

import { ThemedText } from "./ThemedText";
import { Spacing, BorderRadius } from "../constants/theme";
import { Feeling } from "../types";

interface FeelingCardProps {
  feeling: Feeling;
  onPress: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.4,
  stiffness: 150,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FeelingCard({ feeling, onPress }: FeelingCardProps) {
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
    onPress();
  };

  const content = (
    <>
      <View style={styles.iconContainer}>
        <Feather name={feeling.icon as any} size={22} color="rgba(255, 255, 255, 0.85)" />
      </View>
      <ThemedText style={styles.name}>{feeling.name}</ThemedText>
    </>
  );

  if (Platform.OS === "ios") {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, animatedStyle]}
        testID={`feeling-card-${feeling.id}`}
      >
        <BlurView
          intensity={15}
          tint="dark"
          style={styles.blurContent}
        >
          <View style={styles.cardInner}>
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
      style={[styles.card, styles.fallback, animatedStyle]}
      testID={`feeling-card-${feeling.id}`}
    >
      {content}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 110,
    margin: Spacing.xs,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  blurContent: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
  },
  cardInner: {
    flex: 1,
    padding: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  fallback: {
    padding: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
    backgroundColor: "rgba(20, 184, 166, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(20, 184, 166, 0.25)",
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    color: "#FFFFFF",
  },
});
