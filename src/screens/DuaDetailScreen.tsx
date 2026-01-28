import React, { useRef, useEffect } from "react";
import { ScrollView, View, StyleSheet, Platform, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

import { ThemedText } from "../components/ThemedText";
import { DisplayOptionChip } from "../components/DisplayOptionChip";
import { MeshGradientBackground } from "../components/MeshGradientBackground";
import { GlassBackButton } from "../components/GlassBackButton";
import { useTheme } from "../hooks/useTheme";
import { usePreferences } from "../context/PreferencesContext";
import { Spacing, BorderRadius } from "../constants/theme";
import { getDuaById } from "../data/duas";
import { DisplayOption, Language } from "../types";

type ScreenRouteProp = RouteProp<{ DuaDetail: { duaId: string } }, "DuaDetail">;

const DISPLAY_OPTIONS: { key: DisplayOption; label: string }[] = [
  { key: "arabic", label: "Arabic" },
  { key: "transliteration", label: "Transliteration" },
  { key: "translation", label: "Translation" },
];

export default function DuaDetailScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation();
  const { preferences, toggleDisplayOption, toggleFavorite, isFavorite } = usePreferences();

  const { duaId } = route.params;
  const dua = getDuaById(duaId);
  const favorite = dua ? isFavorite(dua.id) : false;
  const lang = preferences.language as Exclude<Language, "ar">;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFavorite = async () => {
    if (dua) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await toggleFavorite(dua.id);
    }
  };

  if (!dua) {
    return (
      <MeshGradientBackground>
        <View style={styles.notFound}>
          <ThemedText style={{ color: "#FFFFFF" }}>Dua not found</ThemedText>
        </View>
      </MeshGradientBackground>
    );
  }

  const showArabic = preferences.displayOptions.includes("arabic");
  const showTransliteration = preferences.displayOptions.includes("transliteration");
  const showTranslation = preferences.displayOptions.includes("translation");

  const renderGlassSection = (children: React.ReactNode, delay: number) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    if (Platform.OS === "ios") {
      return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
          <BlurView
            intensity={15}
            tint="dark"
            style={styles.glassSection}
          >
            <View style={styles.glassSectionInner}>
              {children}
            </View>
          </BlurView>
        </Animated.View>
      );
    }
    return (
      <Animated.View
        style={[styles.glassSectionFallback, { opacity: fadeAnim, transform: [{ translateY }] }]}
      >
        {children}
      </Animated.View>
    );
  };

  const renderGlassButton = (onPress: () => void, icon: string, isActive?: boolean) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, []);

    if (Platform.OS === "ios") {
      return (
        <Animated.View style={{ opacity: fadeAnim }}>
          <BlurView intensity={15} tint="dark" style={styles.navButtonBlur}>
            <View
              style={styles.navButtonInner}
              onTouchEnd={onPress}
            >
              <Feather
                name={icon as any}
                size={20}
                color={isActive ? "#EF4444" : "rgba(255, 255, 255, 0.9)"}
              />
            </View>
          </BlurView>
        </Animated.View>
      );
    }
    return (
      <Animated.View
        style={[styles.navButtonFallback, { opacity: fadeAnim }]}
        onTouchEnd={onPress}
      >
        <Feather
          name={icon as any}
          size={20}
          color={isActive ? "#EF4444" : "rgba(255, 255, 255, 0.9)"}
        />
      </Animated.View>
    );
  };

  return (
    <MeshGradientBackground>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: insets.bottom + Spacing["4xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.navRow}>
          <GlassBackButton onPress={handleBack} />
          <View style={styles.spacer} />
          {renderGlassButton(handleFavorite, "heart", favorite)}
        </View>

        {(() => {
          const fadeAnim = useRef(new Animated.Value(0)).current;

          useEffect(() => {
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              delay: 100,
              useNativeDriver: true,
            }).start();
          }, []);

          return (
            <Animated.View style={[styles.chipsRow, { opacity: fadeAnim }]}>
              {DISPLAY_OPTIONS.map((option) => (
                <DisplayOptionChip
                  key={option.key}
                  option={option.key}
                  label={option.label}
                  isActive={preferences.displayOptions.includes(option.key)}
                  onToggle={() => toggleDisplayOption(option.key)}
                />
              ))}
            </Animated.View>
          );
        })()}

        {showArabic
          ? renderGlassSection(
              <ThemedText style={styles.arabicText}>{dua.arabic}</ThemedText>,
              100
            )
          : null}

        {showTransliteration
          ? renderGlassSection(
              <>
                <View style={styles.quoteBar} />
                <ThemedText style={styles.transliterationText}>
                  {dua.transliteration[lang === "ar" ? "en" : lang] || dua.transliteration.en}
                </ThemedText>
              </>,
              200
            )
          : null}

        {showTranslation
          ? renderGlassSection(
              <ThemedText style={styles.translationText}>
                "{dua.translation[lang === "ar" ? "en" : lang] || dua.translation.en}"
              </ThemedText>,
              300
            )
          : null}

        {dua.reference ? (() => {
          const fadeAnim = useRef(new Animated.Value(0)).current;
          const translateY = useRef(new Animated.Value(30)).current;

          useEffect(() => {
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: 400,
                useNativeDriver: true,
              }),
              Animated.spring(translateY, {
                toValue: 0,
                delay: 400,
                useNativeDriver: true,
              }),
            ]).start();
          }, []);

          return (
            <Animated.View
              style={[styles.referenceSection, { opacity: fadeAnim, transform: [{ translateY }] }]}
            >
              <View style={styles.referenceBadge}>
                <ThemedText style={styles.referenceLabel}>Reference</ThemedText>
                <ThemedText style={styles.referenceText}>
                  {dua.reference}
                </ThemedText>
              </View>
            </Animated.View>
          );
        })() : null}
      </ScrollView>
    </MeshGradientBackground>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  navButtonBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  navButtonInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  navButtonFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  spacer: {
    flex: 1,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.xl,
  },
  glassSection: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
  },
  glassSectionInner: {
    padding: Spacing["2xl"],
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  glassSectionFallback: {
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  arabicText: {
    fontSize: 28,
    lineHeight: 52,
    textAlign: "center",
    fontFamily: "Amiri_400Regular",
    color: "#FFFFFF",
  },
  quoteBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderRadius: 2,
    backgroundColor: "#14B8A6",
  },
  transliterationText: {
    fontSize: 16,
    lineHeight: 28,
    fontStyle: "italic",
    fontWeight: "500",
    textAlign: "center",
    paddingLeft: Spacing.md,
    color: "#14B8A6",
  },
  translationText: {
    fontSize: 16,
    lineHeight: 28,
    fontStyle: "italic",
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
  },
  referenceSection: {
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  referenceBadge: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    backgroundColor: "rgba(20, 184, 166, 0.15)",
  },
  referenceLabel: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
    color: "rgba(255, 255, 255, 0.5)",
  },
  referenceText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#14B8A6",
  },
});
