// components/TodoItem.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  FadeInUp, // Use Reanimated's layout animations for simple component entrance
  // For more complex animations on scroll, consider useAnimatedScrollHandler
} from 'react-native-reanimated';
import { useTheme, ThemeType } from '../context/ThemeContext';
import { Todo } from '../hooks/useConvexTodos'; // Import the Todo type
import Icon from 'react-native-vector-icons/Feather'; // Using Feather icons

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  // This is a simplified prop; actual drag-and-sort will use a wrapper
  isDragging: boolean; 
}

// Helper function to dynamically generate styles based on theme
const getStyles = (theme: ThemeType, isCompleted: boolean) => StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.todoBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.inputBorder,
    // Pixel-perfect shadow for the item card (subtle lift on the desktop design)
    shadowColor: theme.mode === 'light' ? '#000' : '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.mode === 'light' ? 0.05 : 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  // Style for the circular checkbox border
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: isCompleted ? 0 : 1, // No border when completed (gradient covers it)
    borderColor: isCompleted ? 'transparent' : theme.colors.secondaryText,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Gradient overlay for completed state
  completedGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    opacity: 1,
  },
  // Checkmark icon style
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  // Text style based on completion
  todoText: {
    flex: 1,
    fontSize: 16,
    color: isCompleted ? theme.colors.secondaryText : theme.colors.text,
    textDecorationLine: isCompleted ? 'line-through' : 'none',
  },
  // Delete button style
  deleteButton: {
    padding: 5,
    marginLeft: 15,
  }
});

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, isDragging }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, todo.isCompleted);
  
  // Custom fade-in/slide-in animation on mount for the component
  // Using `FadeInUp` from Reanimated simplifies the entry animation
  const enteringAnimation = FadeInUp.duration(600).springify().delay(Math.random() * 50);

  // Animated style for the container to adjust opacity/scale if needed
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      // Optional: Add a subtle scale down effect while dragging
      transform: [{ scale: withTiming(isDragging ? 1.05 : 1, { duration: 150 }) }],
      // Optional: Add shadow/opacity changes for dragging feedback
    };
  });

  // Gradient colors for the completed state, replicating the background header
  const completedGradientColors = [
    theme.mode === 'light' ? '#57DDFF' : '#7E7EFB', 
    theme.mode === 'light' ? '#C058F3' : '#464687'
  ];

  return (
    // Use Animated.View for the scroll effect (FadeInUp)
    <Animated.View style={[styles.itemContainer, containerAnimatedStyle]} entering={enteringAnimation}>
      
      {/* ⚠️ Semantic Markup: TouchableOpacity as a button/switch */}
      <TouchableOpacity 
        style={styles.checkCircle} 
        onPress={() => onToggle(todo._id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.isCompleted }}
      >
        {todo.isCompleted && (
          // Use Expo LinearGradient here (requires expo install expo-linear-gradient)
          // Since we are not using a library, we use a placeholder:
          <View style={styles.completedGradient}>
            <Text style={styles.checkIcon}>✓</Text> 
          </View>
        )}
      </TouchableOpacity>

      {/* ⚠️ Semantic Markup: Text for the content */}
      <Text style={styles.todoText} numberOfLines={1}>
        {todo.title}
      </Text>

      {/* ⚠️ Semantic Markup: TouchableOpacity for deletion */}
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