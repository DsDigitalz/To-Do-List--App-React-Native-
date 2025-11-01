// screens/HomeScreen.tsx
import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
// Use expo-linear-gradient for Expo projects
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, ThemeType } from "../context/ThemeContext";
import useConvexTodos from "../hooks/useConvexTodos";

// Placeholder Components (to be implemented)
import TodoList from "../components/TodoList"; // Will handle filtering and drag-sort
import TodoInput from "../components/TodoInput"; // Will handle adding new todos

const { width } = Dimensions.get("window");

// ⚠️ Semantic markups: View as the container, Text as content

const HomeScreen = () => {
  const { theme, toggleTheme } = useTheme();

  // Destructure all necessary functions and data from the Convex hook
  const {
    todos,
    loading,
    filter,
    setFilter,
    handleAddTodo,
    handleDeleteTodo,
    // Add handleToggleTodo, handleUpdateTodo here when implemented
  } = useConvexTodos();

  // Use the dynamic styles based on the current theme
  const styles = getStyles(theme);

  return (
    <View style={styles.appContainer}>
      {/* 1. Background Header Area (Gradient/Image Placeholder) */}
      <View style={styles.headerContainer}>
        {/* Replicating the purple/blue gradient from the Figma design */}
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* A potential image layer could go here if using a background image */}
        </LinearGradient>
      </View>

      <SafeAreaView style={styles.contentContainer}>
        {/* 2. Todo Header (Title and Theme Switcher) */}
        <View style={styles.todoHeader}>
          <Text style={styles.title} accessibilityRole="header">
            T O D O
          </Text>

          {/* Theme Switcher Button */}
          <TouchableOpacity
            onPress={toggleTheme}
            accessibilityRole="switch"
            accessibilityLabel={`Switch to ${
              theme.mode === "light" ? "dark" : "light"
            } theme`}
          >
            {/* Using a text representation for the icon */}
            <Text style={styles.themeIconText}>
              {theme.mode === "light" ? "🌙" : "☀️"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. Main Content Area (Input and List) */}
        <View style={styles.mainContent}>
          {/* Todo Input Component: Passes the creation function */}
          <TodoInput handleAddTodo={handleAddTodo} theme={theme} />

          {/* Todo List Component: Passes data, actions, and filter state */}
          <TodoList
            todos={todos}
            loading={loading}
            onDelete={handleDeleteTodo}
            // onToggle={handleToggleTodo} // Pass the toggle function here
            currentFilter={filter}
            onFilterChange={setFilter}
            theme={theme}
          />

          {/* Final Drag-and-Drop Hint */}
          <Text style={styles.dragHint}>Drag and drop to reorder list</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

// --- Stylesheet for Pixel-Perfect Layout ---

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      // This container determines the size of the background image/gradient
      height: width > 768 ? 300 : 200,
      width: "100%",
      position: "absolute",
      top: 0,
      // Add zIndex to ensure it's below the SafeAreaView content on some platforms
    },
    gradient: {
      flex: 1,
      // The image in the Figma design is complex; for a simple replication,
      // we use the colors defined in the theme.
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 24,
      // Align items to center to respect the desktop max-width
      alignItems: "center",
      justifyContent: "flex-start",
    },
    todoHeader: {
      width: "100%",
      // Respect the desktop design max width
      maxWidth: 540,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: Platform.OS === "android" ? 60 : 20, // Adjust for status bar/safe area
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      letterSpacing: 10,
      color: "#FFFFFF",
    },
    themeIconText: {
      fontSize: 24,
      color: "#FFFFFF",
    },
    mainContent: {
      width: "100%",
      maxWidth: 540,
    },
    dragHint: {
      marginTop: 50,
      textAlign: "center",
      color: theme.colors.secondaryText,
      fontSize: 14,
    },
  });

export default HomeScreen;
