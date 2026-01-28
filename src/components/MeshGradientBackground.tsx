import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle, Dimensions, Platform } from "react-native";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

interface MeshGradientBackgroundProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function MeshGradientBackground({
  children,
  style,
}: MeshGradientBackgroundProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.base} />

      <View style={[styles.glowOrb, styles.orb1]} />
      <View style={[styles.glowOrb, styles.orb2]} />
      <View style={[styles.glowOrb, styles.orb3]} />
      <View style={[styles.glowOrb, styles.orb4]} />

      {Platform.OS === "ios" ? (
        <BlurView
          intensity={60}
          tint="dark"
          style={styles.blurOverlay}
        />
      ) : (
        <View style={styles.webOverlay} />
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0A1A1F",
  },
  glowOrb: {
    position: "absolute",
    borderRadius: 9999,
  },
  orb1: {
    width: width * 1.6,
    height: width * 1.6,
    top: height * 0.15,
    left: -width * 0.5,
    backgroundColor: "#B91C1C",
    opacity: 0.7,
    ...Platform.select({
      ios: {
        shadowColor: "#DC2626",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 150,
      },
      android: {
        elevation: 20,
      },
      web: {
        // @ts-ignore
        filter: "blur(100px)",
      },
    }),
  },
  orb2: {
    width: width * 1.3,
    height: width * 1.3,
    top: height * 0.25,
    right: -width * 0.4,
    backgroundColor: "#EA580C",
    opacity: 0.6,
    ...Platform.select({
      ios: {
        shadowColor: "#F97316",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 120,
      },
      android: {
        elevation: 18,
      },
      web: {
        // @ts-ignore
        filter: "blur(90px)",
      },
    }),
  },
  orb3: {
    width: width * 0.9,
    height: width * 0.9,
    bottom: height * 0.15,
    right: -width * 0.3,
    backgroundColor: "#0D9488",
    opacity: 0.5,
    ...Platform.select({
      ios: {
        shadowColor: "#14B8A6",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 100,
      },
      android: {
        elevation: 15,
      },
      web: {
        // @ts-ignore
        filter: "blur(80px)",
      },
    }),
  },
  orb4: {
    width: width * 0.7,
    height: width * 0.7,
    top: -width * 0.15,
    right: width * 0.1,
    backgroundColor: "#0E7490",
    opacity: 0.4,
    ...Platform.select({
      ios: {
        shadowColor: "#06B6D4",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 80,
      },
      android: {
        elevation: 12,
      },
      web: {
        // @ts-ignore
        filter: "blur(70px)",
      },
    }),
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  webOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 26, 31, 0.3)",
  },
});
