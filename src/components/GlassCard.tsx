import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle, Platform } from "react-native";
import { BlurView } from "expo-blur";

import { BorderRadius } from "../constants/theme";

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  intensity?: number;
  borderRadius?: number;
}

export function GlassCard({
  children,
  style,
  intensity = 40,
  borderRadius = BorderRadius.xl,
}: GlassCardProps) {
  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={intensity}
        tint="dark"
        style={[
          styles.blur,
          {
            borderRadius,
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
          style,
        ]}
      >
        <View
          style={[
            styles.innerContent,
            {
              borderRadius,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            }
          ]}
        >
          {children}
        </View>
      </BlurView>
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          backgroundColor: "rgba(30, 45, 60, 0.85)",
          borderColor: "rgba(255, 255, 255, 0.15)",
          borderRadius,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  blur: {
    overflow: "hidden",
    borderWidth: 1,
  },
  innerContent: {
    flex: 1,
  },
  fallback: {
    borderWidth: 1,
    overflow: "hidden",
  },
});
