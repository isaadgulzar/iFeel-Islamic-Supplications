import React from "react";
import { View, StyleSheet, Modal, Platform, Pressable, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius } from "../constants/theme";

interface AnalyticsConsentModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function AnalyticsConsentModal({ visible, onAccept, onDecline }: AnalyticsConsentModalProps) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {Platform.OS === "ios" ? (
            <BlurView intensity={80} tint="dark" style={styles.modalBlur}>
              <View style={[styles.modalContent, { backgroundColor: "rgba(15, 23, 42, 0.95)" }]}>
                <ModalContent onAccept={onAccept} onDecline={onDecline} />
              </View>
            </BlurView>
          ) : (
            <View style={[styles.modalContent, { backgroundColor: "#0F172A" }]}>
              <ModalContent onAccept={onAccept} onDecline={onDecline} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

interface ModalContentProps {
  onAccept: () => void;
  onDecline: () => void;
}

function ModalContent({ onAccept, onDecline }: ModalContentProps) {
  const scaleAccept = React.useRef(new Animated.Value(1)).current;
  const scaleDecline = React.useRef(new Animated.Value(1)).current;

  const handleAcceptPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAccept();
  };

  const handleDeclinePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecline();
  };

  const animateButton = (scale: Animated.Value, toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={["#A855F7", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          <Feather name="heart" size={36} color="#FFFFFF" />
        </LinearGradient>
      </View>

      <ThemedText style={styles.title}>Help iFeel Get Better</ThemedText>

      <ThemedText style={styles.description}>
        We'd love to understand which duas bring you the most peace. Your anonymous usage helps us serve you better.
      </ThemedText>

      <View style={styles.bulletContainer}>
        <View style={styles.bulletRow}>
          <View style={styles.checkCircle}>
            <Feather name="check" size={14} color="#10B981" />
          </View>
          <ThemedText style={styles.bulletText}>100% anonymous & private</ThemedText>
        </View>
        <View style={styles.bulletRow}>
          <View style={styles.checkCircle}>
            <Feather name="check" size={14} color="#10B981" />
          </View>
          <ThemedText style={styles.bulletText}>See which duas help most Muslims</ThemedText>
        </View>
        <View style={styles.bulletRow}>
          <View style={styles.checkCircle}>
            <Feather name="check" size={14} color="#10B981" />
          </View>
          <ThemedText style={styles.bulletText}>No personal info, ever</ThemedText>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ scale: scaleAccept }] }}>
          <Pressable
            onPress={handleAcceptPress}
            onPressIn={() => animateButton(scaleAccept, 0.96)}
            onPressOut={() => animateButton(scaleAccept, 1)}
          >
            <LinearGradient
              colors={["#A855F7", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}
            >
              <Feather name="check-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <ThemedText style={styles.primaryButtonText}>Sure, Help Improve iFeel</ThemedText>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleDecline }] }}>
          <Pressable
            onPress={handleDeclinePress}
            onPressIn={() => animateButton(scaleDecline, 0.98)}
            onPressOut={() => animateButton(scaleDecline, 1)}
          >
            <View style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>Maybe Later</ThemedText>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      <ThemedText style={styles.footnote}>
        Change anytime in Settings • No spam, ever
      </ThemedText>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
  },
  modalBlur: {
    borderRadius: BorderRadius["2xl"],
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
  },
  modalContent: {
    padding: Spacing["2xl"],
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: Spacing.md,
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: Spacing.xl,
    fontFamily: "Inter_400Regular",
  },
  bulletContainer: {
    gap: Spacing.md,
    marginBottom: Spacing["2xl"],
    paddingHorizontal: Spacing.sm,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  bulletText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    flex: 1,
    fontFamily: "Inter_500Medium",
  },
  buttonContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  primaryButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 56,
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: "Inter_500Medium",
  },
  footnote: {
    fontSize: 12,
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.4)",
    fontFamily: "Inter_400Regular",
  },
});
