import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
// For drag-and-sort, we'd use a specialized library, e.g.,
// import DraggableFlatList from 'react-native-draggable-flatlist';

import { useTheme, ThemeType } from "../context/ThemeContext";
import { Todo } from "../hooks/useConvexTodos";
import TodoItem from "./TodoItem"; // The animated item component

// Define the filter types
type TodoFilter = "all" | "active" | "completed";

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onDelete: (id: string) => void;
  // Placeholder for the toggle function (required for TodoItem)
  onToggle: (id: string) => void;
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  theme: ThemeType;
}

// Helper to determine styles based on theme and state
const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    listContainer: {
      // Top margin aligns it with the input field just above it
      marginTop: 24,
      borderRadius: 8,
      // Add shadow to the list container to match the Figma design's card look
      shadowColor: theme.mode === "light" ? "#000" : "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.mode === "light" ? 0.05 : 0.4,
      shadowRadius: 10,
      elevation: 5,
    },
    // The animated view wraps the list and filter bar
    animatedWrapper: {
      backgroundColor: theme.colors.todoBackground,
      borderRadius: 8,
      overflow: "hidden", // Ensures items don't leak past the rounded corners
    },
    // Style for the bottom footer with item count and filter bar
    footerBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    filterContainer: {
      flexDirection: "row",
      // On mobile, the filter bar might be separate, but on desktop it's in the footer
      // Match the mobile/desktop view from Figma
      position: "absolute",
      left: "50%",
      transform: [{ translateX: -70 }], // Centering hack for absolute position
      backgroundColor: theme.colors.todoBackground,
      paddingHorizontal: 15,
      borderRadius: 8,
      shadowColor: theme.mode === "light" ? "#000" : "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.mode === "light" ? 0.05 : 0.4,
      shadowRadius: 4,
      elevation: 3,
    },
    // Mobile only filter container (if separate card is needed, otherwise use footerBar)
    mobileFilterContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
      backgroundColor: theme.colors.todoBackground,
      paddingVertical: 15,
      borderRadius: 8,
    },
    filterButton: {
      paddingHorizontal: 8,
    },
    filterText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.secondaryText,
    },
    activeFilterText: {
      color: theme.colors.primary, // Blue accent for active filter
    },
    countText: {
      color: theme.colors.secondaryText,
      fontSize: 12,
    },
    emptyState: {
      padding: 40,
      alignItems: "center",
    },
  });

// Component for the filter buttons
const FilterButtons: React.FC<{
  currentFilter: TodoFilter;
  onFilterChange: (f: TodoFilter) => void;
  theme: ThemeType;
}> = ({ currentFilter, onFilterChange, theme }) => {
  const styles = getStyles(theme);
  const filters: TodoFilter[] = ["all", "active", "completed"];

  return (
    <View
      style={StyleSheet.flatten([
        styles.filterContainer,
        styles.mobileFilterContainer,
      ])}
    >
      {filters.map((filter) => (
        // ⚠️ Semantic Markup: TouchableOpacity as a button
        <TouchableOpacity
          key={filter}
          onPress={() => onFilterChange(filter)}
          style={styles.filterButton}
          accessibilityRole="button"
          accessibilityLabel={`Show ${filter} todos`}
        >
          <Text
            style={[
              styles.filterText,
              currentFilter === filter && styles.activeFilterText,
            ]}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  onDelete,
  onToggle,
  currentFilter,
  onFilterChange,
  theme,
}) => {
  const styles = getStyles(theme);
  const activeTodos = todos.filter((t) => !t.isCompleted);

  // --- Placeholder for Drag-and-Sort Setup ---
  // If using `react-native-draggable-flatlist`, this section would be replaced
  // with the renderItem prop of that list component.
  const renderItem = useCallback(
    ({ item }: { item: Todo }) => (
      <TodoItem
        todo={item}
        onDelete={onDelete}
        onToggle={onToggle} // Toggle function is required
        isDragging={false} // This prop would be controlled by the DraggableFlatList state
      />
    ),
    [onDelete, onToggle]
  );
  // --- End Placeholder ---

  if (loading) {
    return (
      <View style={styles.listContainer}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ padding: 30 }}
        />
      </View>
    );
  }

  // Use reanimated for a clean list entry/exit transition
  return (
    <View style={styles.listContainer} accessibilityRole="list">
      <Animated.View
        style={styles.animatedWrapper}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(400)}
      >
        {/* Render all the Todo Items */}
        {todos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ color: theme.colors.secondaryText }}>
              {currentFilter === "completed"
                ? "No tasks completed yet!"
                : "Add your first task."}
            </Text>
          </View>
        ) : (
          <View>
            {/* ⚠️ DRAG-AND-SORT IMPLEMENTATION NOTE:
              Replace this basic map with a DraggableFlatList/Swipeable component 
              to enable reordering and swipe-to-delete.
            */}
            {todos.map((item) => (
              <React.Fragment key={item._id}>
                {renderItem({ item })}
              </React.Fragment>
            ))}
          </View>
        )}

        {/* Footer Bar (Item count and Clear Completed) */}
        <View style={styles.footerBar}>
          <Text style={styles.countText}>{activeTodos.length} items left</Text>

          {/* Desktop Filter Buttons (visible on larger screens or moved outside on mobile) */}
          <View style={{ flexDirection: "row" }}>
            {/* The Figma design has filters inside the footer on Desktop */}
            <FilterButtons
              currentFilter={currentFilter}
              onFilterChange={onFilterChange}
              theme={theme}
            />
          </View>

          {/* Clear Completed Button */}
          <TouchableOpacity
            // onPress={handleClearCompleted} // Needs to be added to useConvexTodos
            accessibilityRole="button"
            accessibilityLabel="Clear all completed todos"
          >
            <Text style={styles.countText}>Clear Completed</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Mobile/Floating Filter Bar (Optional, if separate from the list footer is desired) */}
      {/* This component is already included in the footer for the desktop-like view */}
    </View>
  );
};

export default TodoList;
