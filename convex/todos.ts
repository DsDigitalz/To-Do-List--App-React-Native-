import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// ... (todoSchema, getTodos, createTodo functions remain the same) ...

// --- DELETE Operation ---
/**
 * Deletes a todo item by its Convex ID.
 */
export const deleteTodo = mutation({
  args: {
    id: v.id("todos"), // Expects a valid Todo ID
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// --- UPDATE/TOGGLE Operation ---
/**
 * Toggles the 'isCompleted' status of a todo item.
 */
export const toggleTodo = mutation({
  args: {
    id: v.id("todos"),
    isCompleted: v.boolean(), // The new status to set
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isCompleted: args.isCompleted,
    });
  },
});

// --- CLEAR COMPLETED Operation (Bonus Feature) ---
/**
 * Deletes all todos that are marked as completed.
 */
export const clearCompletedTodos = mutation({
  handler: async (ctx) => {
    const completedTodos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("isCompleted"), true)) // Find where isCompleted is true
      .collect();

    // Use Promise.all to delete them concurrently
    await Promise.all(completedTodos.map((todo) => ctx.db.delete(todo._id)));
  },
});
