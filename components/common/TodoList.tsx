// components/TodoList.tsx
import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
// Requires: npm install --save react-native-draggable-flatlist
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { ThemeType } from "../../context/ThemeContext";
import { Todo } from "../../hooks/useConvexTodos";
import TodoItem from "./TodoItem";

type TodoFilter = "all" | "active" | "completed";

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onDelete: (id: string) => void;
  onToggle: (todo: Todo) => void;
  onClearCompleted: () => void;
  handleSortTodos: (reorderedTodos: Todo[]) => void;
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  theme: ThemeType;
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    listContainer: {
      borderRadius: 8,
      // Apply the floating card shadow for the list container
      shadowColor: theme.mode === "light" ? "#000" : "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.mode === "light" ? 0.05 : 0.4,
      shadowRadius: 10,
      elevation: 5,
    },
    animatedWrapper: {
      backgroundColor: theme.colors.todoBackground,
      borderRadius: 8,
      overflow: "hidden",
    },
    footerBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
    },
    // Style for the centered filter bar (desktop view)
    filterContainerDesktop: {
      flexDirection: "row",
    },
    // Style for the separate filter bar (mobile view below the list)
    filterContainerMobile: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
      backgroundColor: theme.colors.todoBackground,
      paddingVertical: 15,
      borderRadius: 8,
    },
    filterButton: { paddingHorizontal: 8 },
    filterText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.secondaryText,
    },
    activeFilterText: { color: theme.colors.primary },
    countText: { color: theme.colors.secondaryText, fontSize: 12 },
    emptyState: { padding: 40, alignItems: "center" },
  });

// Filter component for reusability
const FilterButtons: React.FC<{
  currentFilter: TodoFilter;
  onFilterChange: (f: TodoFilter) => void;
  theme: ThemeType;
  isMobile: boolean;
}> = ({ currentFilter, onFilterChange, theme, isMobile }) => {
  const styles = getStyles(theme);
  const filters: TodoFilter[] = ["all", "active", "completed"];

  return (
    <View
      style={
        isMobile ? styles.filterContainerMobile : styles.filterContainerDesktop
      }
    >
      {filters.map((filter) => (
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
  onClearCompleted,
  handleSortTodos,
  currentFilter,
  onFilterChange,
  theme,
}) => {
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();
  const isMobile = width < 768; // Adjust threshold as needed
  const activeTodos = todos.filter((t) => !t.isCompleted);

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Todo>) => (
      <ScaleDecorator>
        <TodoItem
          todo={item}
          onDelete={onDelete}
          onToggle={onToggle}
          isDragging={isActive}
          drag={drag}
        />
      </ScaleDecorator>
    ),
    [onDelete, onToggle]
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        style={{ padding: 30 }}
      />
    );
  }

  return (
    <View style={styles.listContainer} accessibilityRole="list">
      <Animated.View
        style={styles.animatedWrapper}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(400)}
      >
        {todos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ color: theme.colors.secondaryText }}>
              {currentFilter === "completed"
                ? "No tasks completed yet!"
                : "Add your first task."}
            </Text>
          </View>
        ) : (
          <DraggableFlatList
            data={todos}
            keyExtractor={(item) => item._id}
            onDragEnd={({ data }) => handleSortTodos(data)} // Persist the new order
            renderItem={renderItem}
            activationDistance={5}
            scrollEnabled={false} // Prevent scrolling within the list if items fit the screen
          />
        )}

        {/* Footer Bar (Count, Clear Completed, Desktop Filters) */}
        <View style={styles.footerBar}>
          <Text style={styles.countText}>{activeTodos.length} items left</Text>

          {/* Desktop Filter Buttons (Hidden on mobile) */}
          {!isMobile && (
            <FilterButtons
              currentFilter={currentFilter}
              onFilterChange={onFilterChange}
              theme={theme}
              isMobile={false}
            />
          )}

          <TouchableOpacity
            onPress={onClearCompleted}
            accessibilityRole="button"
            accessibilityLabel="Clear all completed todos"
          >
            <Text style={styles.countText}>Clear Completed</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Mobile Filter Bar (Separate card below the main list) */}
      {isMobile && (
        <View style={{ marginTop: 20 }}>
          <FilterButtons
            currentFilter={currentFilter}
            onFilterChange={onFilterChange}
            theme={theme}
            isMobile={true}
          />
        </View>
      )}
    </View>
  );
};

export default TodoList;
