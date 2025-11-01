import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, ThemeType } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather'; // Using Feather icons

interface TodoInputProps {
  handleAddTodo: (title: string, description?: string) => void;
  theme: ThemeType;
}

// Helper function to dynamically generate styles based on theme
const getStyles = (theme: ThemeType) => StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: theme.colors.inputBackground, // Themed background
    // Apply the floating card shadow from the Figma design
    shadowColor: theme.mode === 'light' ? '#000' : '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.mode === 'light' ? 0.05 : 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  // The 'checkbox' circle on the left side (uncompleted state)
  fakeCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.secondaryText,
    marginRight: 15,
  },
  // Style for the text input field
  input: {
    flex: 1,
    fontSize: 16,
    // Use primary text color when active, secondary when empty/placeholder
    color: theme.colors.text, 
    paddingVertical: 0, // Ensure no extra padding inside TextInput
  },
});

const TodoInput: React.FC<TodoInputProps> = ({ handleAddTodo, theme }) => {
  const [todoText, setTodoText] = useState('');
  const styles = getStyles(theme);

  const handleSubmit = () => {
    const trimmedText = todoText.trim();
    if (trimmedText.length > 0) {
      // Call the Convex mutation function passed from HomeScreen
      handleAddTodo(trimmedText); 
      setTodoText(''); // Clear the input field
    }
  };

  return (
    // ⚠️ Semantic Markup: View as the container
    <View style={styles.inputContainer} accessibilityRole="form">
      
      {/* 1. Fake Check Circle */}
      {/* This circle serves as a visual placeholder aligning the input with the list items */}
      <View style={styles.fakeCheckCircle} />
      
      {/* 2. Text Input */}
      {/* Uses keyboardType 'default' and submits on hitting Enter/Done */}
      <TextInput
        style={styles.input}
        value={todoText}
        onChangeText={setTodoText}
        placeholder="Create a new todo..."
        placeholderTextColor={theme.colors.secondaryText}
        onSubmitEditing={handleSubmit} // Submit when the user hits 'Done' on the keyboard
        returnKeyType="done"
        accessibilityLabel="New Todo Input"
      />
      
      {/* 3. Invisible Submit Button (Optional - Input handles submission) */}
      {/* The Figma design doesn't show an explicit button, so we rely on onSubmitEditing, 
          but we could add a transparent touchable area here if desired for mobile UX. */}
    </View>
  );
};

export default TodoInput;