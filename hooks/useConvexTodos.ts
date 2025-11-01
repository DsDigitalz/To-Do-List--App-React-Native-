// hooks/useConvexTodos.ts
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Doc } from "../convex/_generated/dataModel";
import { useState } from "react";

export type Todo = Doc<"todos"> & { position?: number }; // Include position for sorting

export const useConvexTodos = () => {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // 1. READ
  const todos = useQuery(api.todos.getTodos, { filter });

  // 2. MUTATIONS
  const addTodo = useMutation(api.todos.createTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const toggleTodoMutation = useMutation(api.todos.toggleTodo);
  const clearCompleted = useMutation(api.todos.clearCompletedTodos);
  const updatePositions = useMutation(api.todos.updateTodoPositions);

  const handleAddTodo = async (title: string, description?: string) => {
    try {
      await addTodo({ title, description });
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleDeleteTodo = async (id: Doc<"todos">["_id"]) => {
    try {
      await deleteTodo({ id });
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      await toggleTodoMutation({
        id: todo._id,
        isCompleted: !todo.isCompleted,
      });
    } catch (error) {
      console.error("Failed to toggle todo status:", error);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await clearCompleted({});
    } catch (error) {
      console.error("Failed to clear completed todos:", error);
    }
  };

  const handleSortTodos = async (reorderedTodos: Todo[]) => {
    try {
      const updates = reorderedTodos.map((todo, index) => ({
        id: todo._id,
        position: index, // Use the new array index as the new position
      }));

      await updatePositions({ updates });
    } catch (error) {
      console.error("Failed to update todo positions:", error);
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
    handleToggleTodo,
    handleClearCompleted,
    handleSortTodos, // Export sort function
  };
};

export default useConvexTodos;
