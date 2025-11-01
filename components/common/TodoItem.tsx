// components/TodoItem.tsx
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import Animated, {
  ScaleDecorator,
  FadeInUp,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Feather";
import { ThemeType } from "../context/ThemeContext";
import { Todo } from "../hooks/useConvexTodos";

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  isDragging: boolean;
  drag: () => void; // Function passed from DraggableFlatList
}

const getStyles = (theme: ThemeType, isCompleted: boolean) =>
  StyleSheet.create({
    itemWrapper: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    itemContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 18,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.todoBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.inputBorder,
      // Note: Shadow applied in TodoList parent
    },
    checkCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: isCompleted ? 0 : 1,
      borderColor: isCompleted ? "transparent" : theme.colors.inputBorder,
      marginRight: 15,
      alignItems: "center",
      justifyContent: "center",
    },
    completedGradient: {
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: 12,
      opacity: 1,
      // Note: In a real app, you'd use a gradient component here
      backgroundColor: "#3A7CFD",
    },
    checkIcon: { color: "#FFFFFF", fontSize: 12 },
    todoText: {
      flex: 1,
      fontSize: 16,
      color: isCompleted ? theme.colors.secondaryText : theme.colors.text,
      textDecorationLine: isCompleted ? "line-through" : "none",
    },
    deleteButton: { padding: 5, marginLeft: 15 },
  });

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  isDragging,
  drag,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, todo.isCompleted);

  // ⚠️ Framer Motion / Reanimated Scroll Effect (Entry Animation)
  const enteringAnimation = FadeInUp.duration(600).springify();

  // Animated style for drag feedback
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      // Lift the item slightly when dragging
      backgroundColor: withTiming(
        isDragging ? theme.colors.todoBackground : theme.colors.todoBackground,
        { duration: 150 }
      ),
      opacity: withTiming(isDragging ? 0.9 : 1, { duration: 150 }),
      // You can add a shadow animation here too
    };
  });

  return (
    // ⚠️ Semantic Markup: Animated.View container
    <Animated.View
      style={[styles.itemContainer, containerAnimatedStyle]}
      entering={enteringAnimation}
    >
      {/* ⚠️ Drag Handle (Long press to drag anywhere on the item content) */}
      <TouchableOpacity
        style={styles.itemWrapper}
        onLongPress={drag}
        delayLongPress={200}
        activeOpacity={0.8}
        accessibilityRole="adjustable"
        accessibilityHint="Hold to drag and reorder"
      >
        {/* Check Circle */}
        <TouchableOpacity
          style={styles.checkCircle}
          onPress={() => onToggle(todo)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: todo.isCompleted }}
        >
          {todo.isCompleted && (
            <View style={styles.completedGradient}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Text */}
        <Text style={styles.todoText} numberOfLines={1}>
          {todo.title}
        </Text>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(todo._id)}
        accessibilityLabel="Delete Todo"
        accessibilityRole="button"
      >
        <Icon name="x" size={18} color={theme.colors.secondaryText} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TodoItem;
