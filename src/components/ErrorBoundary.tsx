import React, { Component, ReactNode } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "./ThemedText";
import { MeshGradientBackground } from "./MeshGradientBackground";
import { Spacing, BorderRadius } from "../constants/theme";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error("Error caught by boundary:", error, errorInfo);

    // In production, you could send to error tracking service
    // Example: Sentry, Bugsnag, etc.
  }

  handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <MeshGradientBackground>
          <View style={styles.container}>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Feather name="alert-circle" size={48} color="#EF4444" />
              </View>
            </View>

            <ThemedText style={styles.title}>Something Went Wrong</ThemedText>

            <ThemedText style={styles.message}>
              We encountered an unexpected error. Don't worry, your data is safe.
            </ThemedText>

            {__DEV__ && this.state.error && (
              <View style={styles.errorBox}>
                <ThemedText style={styles.errorText}>
                  {this.state.error.toString()}
                </ThemedText>
              </View>
            )}

            <Pressable
              onPress={this.handleReset}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <Feather name="refresh-cw" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <ThemedText style={styles.buttonText}>Try Again</ThemedText>
            </Pressable>

            <ThemedText style={styles.footnote}>
              If this keeps happening, try restarting the app
            </ThemedText>
          </View>
        </MeshGradientBackground>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: Spacing.md,
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: Spacing["2xl"],
    fontFamily: "Inter_400Regular",
  },
  errorBox: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    maxWidth: "100%",
  },
  errorText: {
    fontSize: 12,
    color: "rgba(239, 68, 68, 0.9)",
    fontFamily: "monospace",
  },
  button: {
    backgroundColor: "#7C3AED",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing["2xl"],
    borderRadius: BorderRadius.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 56,
    minWidth: 200,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
  },
  footnote: {
    fontSize: 13,
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: Spacing.xl,
    fontFamily: "Inter_400Regular",
  },
});
