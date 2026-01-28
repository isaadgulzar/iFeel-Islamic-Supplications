import React, { ReactNode } from "react";
import { StyleSheet, View, Pressable, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SettingsRowProps {
  icon?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  children?: ReactNode;
}

export function SettingsRow({
  icon,
  label,
  value,
  onPress,
  switchValue,
  onSwitchChange,
  children,
}: SettingsRowProps) {
  const { theme } = useTheme();

  const content = (
    <View style={styles.row}>
      {icon ? (
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <Feather name={icon as any} size={18} color="#FFFFFF" />
        </LinearGradient>
      ) : null}
      <View style={styles.labelContainer}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        {value ? (
          <ThemedText style={[styles.value, { color: theme.textSecondary }]}>
            {value}
          </ThemedText>
        ) : null}
      </View>
      {children}
      {onSwitchChange !== undefined ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor="#FFFFFF"
        />
      ) : null}
      {onPress ? (
        <View style={[styles.chevronContainer, { backgroundColor: theme.cardSoft }]}>
          <Feather name="chevron-right" size={18} color={theme.primary} />
        </View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} testID={`settings-row-${label}`}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
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
  },
  value: {
    fontSize: 13,
    marginTop: 2,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
