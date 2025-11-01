import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Doc } from "../convex/_generated/dataModel";
import { useState } from "react";

// Define the type for a Todo item for type safety in the React Native app
export type Todo = Doc<"todos">;

/**
 * Custom hook to manage fetching and modifying todos using Convex.
 */
export const useConvexTodos = () => {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Real-time fetching of todos. Whenever the data changes in the DB, this re-runs.
  const todos = useQuery(api.todos.getTodos, { filter });

  // Mutations for CRUD operations
  const addTodo = useMutation(api.todos.createTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo); // Assuming you add this to todos.ts
  const toggleTodo = useMutation(api.todos.toggleTodo); // Assuming you add this to todos.ts

  // CREATE: Function to add a new todo
  const handleAddTodo = async (title: string, description?: string) => {
    try {
      await addTodo({ title, description, dueDate: undefined });
    } catch (error) {
      console.error("Failed to add todo:", error);
      // Implement proper error notification for the user
    }
  };

  // DELETE: Function to remove a todo
  const handleDeleteTodo = async (id: Doc<"todos">["_id"]) => {
    try {
      // Pass the Convex ID for deletion
      await deleteTodo({ id });
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  // The 'todos' array is null while loading, so we check for that.
  const loading = todos === undefined;

  return {
    todos: todos || [], // Provide an empty array if loading
    loading,
    filter,
    setFilter,
    handleAddTodo,
    handleDeleteTodo,
    // Add other update/toggle functions here
  };
};

export default useConvexTodos;
