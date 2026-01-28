import React from "react";
import { StyleSheet, View, Image, ImageSourcePropType } from "react-native";

import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing } from "../constants/theme";

interface EmptyStateProps {
  image: ImageSourcePropType;
  title: string;
  message: string;
}

export function EmptyState({ image, title, message }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <ThemedText style={[styles.title, { color: theme.text }]}>{title}</ThemedText>
      <ThemedText style={[styles.message, { color: theme.textSecondary }]}>
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing["3xl"],
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: Spacing.xl,
    opacity: 0.9,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
