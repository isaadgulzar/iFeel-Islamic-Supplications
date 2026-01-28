import React from "react";
import { View, StyleSheet, Linking, Image, Platform, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";

import { ThemedText } from "../components/ThemedText";
import { MeshGradientBackground } from "../components/MeshGradientBackground";
import { LanguageSelector } from "../components/LanguageSelector";
import { DisplayOptionChip } from "../components/DisplayOptionChip";
import { useTheme } from "../hooks/useTheme";
import { usePreferences } from "../context/PreferencesContext";
import { Spacing, BorderRadius } from "../constants/theme";
import { DisplayOption, Language } from "../types";

const DISPLAY_OPTIONS: { key: DisplayOption; label: string }[] = [
  { key: "arabic", label: "Arabic" },
  { key: "transliteration", label: "Transliteration" },
  { key: "translation", label: "Translation" },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { preferences, setLanguage, toggleDisplayOption } = usePreferences();

  const openIslamestic = () => {
    Linking.openURL("https://www.islamestic.com/i-am-feeling/");
  };

  const renderGlassSection = (children: React.ReactNode) => {
    if (Platform.OS === "ios") {
      return (
        <BlurView
          intensity={60}
          tint="dark"
          style={[styles.glassSection, { borderColor: theme.border }]}
        >
          {children}
        </BlurView>
      );
    }
    return (
      <View style={[styles.glassSection, { backgroundColor: theme.cardSolid, borderColor: theme.border }]}>
        {children}
      </View>
    );
  };

  return (
    <MeshGradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: 120,
          },
        ]}
      >
        <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
          <ThemedText style={styles.title}>Settings</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400)} style={styles.logoSection}>
          <View style={[styles.logoContainer, { backgroundColor: theme.primary }]}>
            <Image
              source={require("../../assets/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <ThemedText style={styles.appName}>iFeel</ThemedText>
          <ThemedText style={styles.tagline}>Your spiritual companion</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <ThemedText style={styles.sectionTitle}>Language</ThemedText>
          {renderGlassSection(
            <LanguageSelector
              selectedLanguage={preferences.language}
              onSelect={(lang: Language) => setLanguage(lang)}
              label="Translation Language"
            />
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <ThemedText style={styles.sectionTitle}>Display Preferences</ThemedText>
          {renderGlassSection(
            <>
              <ThemedText style={styles.displayLabel}>Show on dua pages:</ThemedText>
              <View style={styles.chipsRow}>
                {DISPLAY_OPTIONS.map((option) => (
                  <DisplayOptionChip
                    key={option.key}
                    option={option.key}
                    label={option.label}
                    isActive={preferences.displayOptions.includes(option.key)}
                    onToggle={() => toggleDisplayOption(option.key)}
                  />
                ))}
              </View>
            </>
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          {renderGlassSection(
            <Pressable onPress={openIslamestic} style={styles.linkRow}>
              <View style={[styles.linkIcon, { backgroundColor: "rgba(124, 58, 237, 0.2)" }]}>
                <Feather name="external-link" size={18} color={theme.primary} />
              </View>
              <View style={styles.linkText}>
                <ThemedText style={styles.linkTitle}>Islamestic</ThemedText>
                <ThemedText style={styles.linkSubtitle}>Original dua collection inspiration</ThemedText>
              </View>
              <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.4)" />
            </Pressable>
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.footer}>
          <ThemedText style={styles.footerText}>iFeel v1.0.0</ThemedText>
          <ThemedText style={styles.footerText}>Made with love for the Ummah</ThemedText>
        </Animated.View>
      </ScrollView>
    </MeshGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  logo: {
    width: 60,
    height: 60,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xs,
    color: "rgba(255, 255, 255, 0.5)",
  },
  glassSection: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  displayLabel: {
    fontSize: 14,
    marginBottom: Spacing.md,
    color: "rgba(255, 255, 255, 0.6)",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  linkText: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  linkSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    marginTop: Spacing["3xl"],
    paddingTop: Spacing.xl,
  },
  footerText: {
    fontSize: 12,
    marginBottom: Spacing.xs,
    color: "rgba(255, 255, 255, 0.4)",
  },
});
