import React, { useState } from "react";
import { StyleSheet, View, Pressable, Modal, FlatList, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Language, LANGUAGE_NAMES } from "@/types";

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelect: (language: Language) => void;
  label: string;
}

const LANGUAGES: Language[] = ["en", "ur", "id", "hi", "bn"];

export function LanguageSelector({
  selectedLanguage,
  onSelect,
  label,
}: LanguageSelectorProps) {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (lang: Language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(lang);
    setModalVisible(false);
  };

  return (
    <>
      <Pressable onPress={() => setModalVisible(true)} style={styles.selector} testID="language-selector">
        <View style={[styles.iconContainer, { backgroundColor: "rgba(124, 58, 237, 0.2)" }]}>
          <Feather name="globe" size={18} color={theme.primary} />
        </View>
        <View style={styles.labelContainer}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          <ThemedText style={[styles.value, { color: theme.primary }]}>
            {LANGUAGE_NAMES[selectedLanguage]}
          </ThemedText>
        </View>
        <View style={[styles.chevronContainer, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
          <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.6)" />
        </View>
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          {Platform.OS === "ios" ? (
            <BlurView intensity={80} tint="dark" style={[styles.modalContent, { borderColor: theme.border }]}>
              <ThemedText style={styles.modalTitle}>Select Language</ThemedText>
              <FlatList
                data={LANGUAGES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    style={[
                      styles.languageItem,
                      item === selectedLanguage && { backgroundColor: "rgba(124, 58, 237, 0.2)" },
                    ]}
                    testID={`language-option-${item}`}
                  >
                    <ThemedText style={styles.languageName}>{LANGUAGE_NAMES[item]}</ThemedText>
                    {item === selectedLanguage ? (
                      <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                        <Feather name="check" size={14} color="#FFFFFF" />
                      </View>
                    ) : null}
                  </Pressable>
                )}
              />
            </BlurView>
          ) : (
            <View style={[styles.modalContent, { backgroundColor: theme.cardSolid, borderColor: theme.border }]}>
              <ThemedText style={styles.modalTitle}>Select Language</ThemedText>
              <FlatList
                data={LANGUAGES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    style={[
                      styles.languageItem,
                      item === selectedLanguage && { backgroundColor: "rgba(124, 58, 237, 0.2)" },
                    ]}
                    testID={`language-option-${item}`}
                  >
                    <ThemedText style={styles.languageName}>{LANGUAGE_NAMES[item]}</ThemedText>
                    {item === selectedLanguage ? (
                      <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                        <Feather name="check" size={14} color="#FFFFFF" />
                      </View>
                    ) : null}
                  </Pressable>
                )}
              />
            </View>
          )}
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  value: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: "500",
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    width: "100%",
    maxWidth: 320,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: Spacing.lg,
    textAlign: "center",
    color: "#FFFFFF",
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
