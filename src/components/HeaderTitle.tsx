import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius } from "../constants/theme";

interface HeaderTitleProps {
  title: string;
}

export function HeaderTitle({ title }: HeaderTitleProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconGradient}
      >
        <Image
          source={require("../../assets/icon.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </LinearGradient>
      <ThemedText style={[styles.title, { color: theme.primary }]}>{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  iconGradient: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    padding: 2,
    marginRight: Spacing.sm,
  },
  icon: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.sm - 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
});
