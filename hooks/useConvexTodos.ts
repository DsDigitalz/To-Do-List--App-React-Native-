import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Doc } from "../convex/_generated/dataModel";
import { useState } from "react";

export type Todo = Doc<"todos">;

export const useConvexTodos = () => {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // 1. READ
  const todos = useQuery(api.todos.getTodos, { filter });

  // 2. MUTATIONS
  const addTodo = useMutation(api.todos.createTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const toggleTodoMutation = useMutation(api.todos.toggleTodo); // Renamed to avoid confusion
  const clearCompleted = useMutation(api.todos.clearCompletedTodos);

  // CREATE: Function to add a new todo (remains the same)
  const handleAddTodo = async (title: string, description?: string) => {
    // ... (implementation remains the same) ...
    try {
      await addTodo({ title, description, dueDate: undefined });
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  // DELETE: Function to remove a single todo (remains the same)
  const handleDeleteTodo = async (id: Doc<"todos">["_id"]) => {
    // ... (implementation remains the same) ...
    try {
      await deleteTodo({ id });
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  // UPDATE: Function to toggle the completion status
  const handleToggleTodo = async (todo: Todo) => {
    try {
      // Pass the new opposite status to the backend
      await toggleTodoMutation({
        id: todo._id,
        isCompleted: !todo.isCompleted,
      });
    } catch (error) {
      console.error("Failed to toggle todo status:", error);
    }
  };

  // CLEAR COMPLETED: Function to remove all completed todos
  const handleClearCompleted = async () => {
    try {
      await clearCompleted({});
    } catch (error) {
      console.error("Failed to clear completed todos:", error);
    }
  };

  const loading = todos === undefined;

  return {
    todos: todos || [],
    loading,
    filter,
    setFilter,
    handleAddTodo,
    handleDeleteTodo,
    handleToggleTodo, // Export the new update function
    handleClearCompleted, // Export the new clear function
    // (Add handleUpdateTodoEdit later for title/description edits)
  };
};

export default useConvexTodos;
