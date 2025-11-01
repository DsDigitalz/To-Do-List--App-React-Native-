// components/TodoInput.tsx
import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { ThemeType } from "../../context/ThemeContext";

interface TodoInputProps {
  handleAddTodo: (title: string, description?: string) => void;
  theme: ThemeType;
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      borderRadius: 8,
      backgroundColor: theme.colors.inputBackground,
      // Pixel-perfect shadow
      shadowColor: theme.mode === "light" ? "#000" : "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.mode === "light" ? 0.05 : 0.4,
      shadowRadius: 10,
      elevation: 5,
      marginBottom: 24, // Space before the list
    },
    fakeCheckCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.secondaryText,
      marginRight: 15,
      opacity: 0.5, // Subtle opacity to match Figma
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      paddingVertical: 0,
    },
  });

const TodoInput: React.FC<TodoInputProps> = ({ handleAddTodo, theme }) => {
  const [todoText, setTodoText] = useState("");
  const styles = getStyles(theme);

  const handleSubmit = () => {
    const trimmedText = todoText.trim();
    if (trimmedText.length > 0) {
      handleAddTodo(trimmedText);
      setTodoText("");
    }
  };

  return (
    // ⚠️ Semantic Markup: View as the form container
    <View style={styles.inputContainer}  accessibilityLabel="New Todo Input Area">
      <View style={styles.fakeCheckCircle} />

      <TextInput
        style={styles.input}
        value={todoText}
        onChangeText={setTodoText}
        placeholder="Create a new todo..."
        placeholderTextColor={theme.colors.secondaryText}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        accessibilityLabel="New Todo Input"
      />
    </View>
  );
};

export default TodoInput;
