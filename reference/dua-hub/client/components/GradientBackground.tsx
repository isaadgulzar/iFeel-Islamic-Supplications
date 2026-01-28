import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/hooks/useTheme";

interface GradientBackgroundProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: "subtle" | "vibrant" | "mesh";
}

export function GradientBackground({
  children,
  style,
  variant = "subtle",
}: GradientBackgroundProps) {
  const { theme, isDark } = useTheme();

  const getGradientColors = (): string[] => {
    if (variant === "vibrant") {
      return isDark
        ? [theme.backgroundRoot, "#1a1a2e", "#16213e"]
        : ["#faf5ff", "#f3e8ff", "#ede9fe"];
    }
    if (variant === "mesh") {
      return isDark
        ? ["#0f0f1a", "#1a1a2e", "#0f172a", "#0f0f1a"]
        : ["#f8fafc", "#faf5ff", "#f0f9ff", "#f8fafc"];
    }
    return isDark
      ? [theme.backgroundRoot, "#0f172a"]
      : [theme.backgroundRoot, "#faf5ff"];
  };

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {variant === "mesh" ? (
        <>
          <View
            style={[
              styles.meshOrb,
              styles.meshOrb1,
              { backgroundColor: isDark ? "rgba(124, 58, 237, 0.15)" : "rgba(124, 58, 237, 0.08)" },
            ]}
          />
          <View
            style={[
              styles.meshOrb,
              styles.meshOrb2,
              { backgroundColor: isDark ? "rgba(236, 72, 153, 0.12)" : "rgba(236, 72, 153, 0.06)" },
            ]}
          />
          <View
            style={[
              styles.meshOrb,
              styles.meshOrb3,
              { backgroundColor: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)" },
            ]}
          />
        </>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  meshOrb: {
    position: "absolute",
    borderRadius: 9999,
  },
  meshOrb1: {
    width: 300,
    height: 300,
    top: -50,
    right: -100,
  },
  meshOrb2: {
    width: 250,
    height: 250,
    bottom: 100,
    left: -80,
  },
  meshOrb3: {
    width: 200,
    height: 200,
    bottom: -50,
    right: 50,
  },
});
