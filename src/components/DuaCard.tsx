import React, { useRef } from "react";
import { StyleSheet, Pressable, View, Platform, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

import { ThemedText } from "./ThemedText";
import { usePreferences } from "../context/PreferencesContext";
import { Spacing, BorderRadius } from "../constants/theme";
import { Dua, Language } from "../types";

interface DuaCardProps {
  dua: Dua;
  index: number;
  onPress: () => void;
}

const springConfig = {
  damping: 15,
  mass: 0.4,
  stiffness: 150,
  useNativeDriver: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DuaCard({ dua, index, onPress }: DuaCardProps) {
  const { preferences, toggleFavorite, isFavorite } = usePreferences();
  const scale = useRef(new Animated.Value(1)).current;

  const favorite = isFavorite(dua.id);
  const lang = preferences.language as Exclude<Language, "ar">;

  const animatedStyle = {
    transform: [{ scale }],
  };

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
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

  const handleFavorite = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await toggleFavorite(dua.id);
  };

  const content = (
    <View style={styles.cardInner}>
      <View style={styles.header}>
        <View style={styles.numberBadge}>
          <ThemedText style={styles.numberText}>{index + 1}</ThemedText>
        </View>
        <Pressable onPress={handleFavorite} hitSlop={12} testID={`favorite-button-${dua.id}`}>
          <Feather
            name="heart"
            size={20}
            color={favorite ? "#EF4444" : "rgba(255,255,255,0.4)"}
            style={{ opacity: favorite ? 1 : 0.8 }}
          />
        </Pressable>
      </View>

      <ThemedText style={styles.arabicText}>
        {dua.arabic}
      </ThemedText>

      <ThemedText style={styles.translationText}>
        {dua.translation[lang === "ar" ? "en" : lang] || dua.translation.en}
      </ThemedText>

      {dua.reference ? (
        <View style={styles.referenceBadge}>
          <ThemedText style={styles.reference}>
            {dua.reference}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );

  if (Platform.OS === "ios") {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, animatedStyle]}
        testID={`dua-card-${dua.id}`}
      >
        <BlurView
          intensity={15}
          tint="dark"
          style={styles.blurContent}
        >
          {content}
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
      testID={`dua-card-${dua.id}`}
    >
      {content}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  blurContent: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
  },
  cardInner: {
    padding: Spacing.xl,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  fallback: {
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#14B8A6",
  },
  numberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  arabicText: {
    fontSize: 22,
    lineHeight: 38,
    textAlign: "right",
    fontFamily: "Amiri_400Regular",
    marginBottom: Spacing.md,
    color: "#FFFFFF",
  },
  translationText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
    color: "rgba(255, 255, 255, 0.6)",
  },
  referenceBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
    backgroundColor: "rgba(20, 184, 166, 0.2)",
  },
  reference: {
    fontSize: 11,
    fontWeight: "600",
    color: "#14B8A6",
  },
});
