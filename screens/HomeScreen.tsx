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
import { LinearGradient } from "expo-linear-gradient"; // Requires: expo install expo-linear-gradient
import Icon from "react-native-vector-icons/Feather"; // Requires: expo install @expo/vector-icons
import { useTheme, ThemeType } from "../context/ThemeContext";
import useConvexTodos from "../hooks/useConvexTodos";

import TodoList from "../components/TodoList";
import TodoInput from "../components/TodoInput";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const { theme, toggleTheme } = useTheme();

  const {
    todos,
    loading,
    filter,
    setFilter,
    handleAddTodo,
    handleDeleteTodo,
    handleToggleTodo,
    handleClearCompleted,
    handleSortTodos,
  } = useConvexTodos();

  const styles = getStyles(theme);

  return (
    <View style={styles.appContainer}>
      {/* ⚠️ Semantic Markup: View as the main container */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      <SafeAreaView style={styles.contentContainer}>
        {/* Header (Title and Theme Switcher) */}
        <View style={styles.todoHeader}>
          <Text style={styles.title} accessibilityRole="header">
            T O D O
          </Text>

          <TouchableOpacity
            onPress={toggleTheme}
            accessibilityRole="switch"
            accessibilityLabel={`Switch to ${theme.mode === "light" ? "dark" : "light"} theme`}
          >
            {/* ⚠️ Theme switching icon */}
            <Icon
              name={theme.mode === "light" ? "moon" : "sun"}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Main Content Area (Input and List) */}
        <View style={styles.mainContent}>
          <TodoInput handleAddTodo={handleAddTodo} theme={theme} />

          <TodoList
            todos={todos}
            loading={loading}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            onClearCompleted={handleClearCompleted}
            handleSortTodos={handleSortTodos} // Drag-and-Sort handler
            currentFilter={filter}
            onFilterChange={setFilter}
            theme={theme}
          />

          {/* ⚠️ Semantic Markup: Hint text */}
          <Text style={styles.dragHint}>Drag and drop to reorder list</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    // ... (Styles from previous steps, ensuring max-width is applied for desktop view)
    appContainer: { flex: 1, backgroundColor: theme.colors.background },
    headerContainer: {
      height: width > 768 ? 300 : 200,
      width: "100%",
      position: "absolute",
      top: 0,
    },
    gradient: { flex: 1 },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    todoHeader: {
      width: "100%",
      maxWidth: 540,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: Platform.OS === "android" ? 60 : 20,
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      letterSpacing: 10,
      color: "#FFFFFF",
    },
    mainContent: { width: "100%", maxWidth: 540 },
    dragHint: {
      marginTop: 50,
      textAlign: "center",
      color: theme.colors.secondaryText,
      fontSize: 14,
    },
  });

export default HomeScreen;
