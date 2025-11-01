import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// --- CREATE Operation ---
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const todoId = await ctx.db.insert("todos", {
      title: args.title,
      description: args.description,
      isCompleted: false, // Always start as incomplete
      createdAt: Date.now(),
      position: Date.now(), // Use creation time as initial position
    });
    return todoId;
  },
});

// --- READ Operation (Real-time Query) ---
export const getTodos = query({
  args: {
    filter: v.optional(
      v.union(v.literal("all"), v.literal("active"), v.literal("completed"))
    ),
  },
  handler: async (ctx, args) => {
    let todos = await ctx.db
      .query("todos")
      // Sort by the 'position' field (used for drag-and-sort)
      .order("desc")
      .collect();

    // Simple filtering logic
    if (args.filter === "active") {
      todos = todos.filter((todo) => !todo.isCompleted);
    } else if (args.filter === "completed") {
      todos = todos.filter((todo) => todo.isCompleted);
    }

    // Sort the filtered list by the 'position' field (ascending for visual order)
    todos.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    return todos;
  },
});

// --- UPDATE/TOGGLE Operation ---
export const toggleTodo = mutation({
  args: {
    id: v.id("todos"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isCompleted: args.isCompleted,
    });
  },
});

// --- DELETE Operation ---
export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// --- UPDATE/SORT Operation ---
export const updateTodoPositions = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("todos"),
        position: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await Promise.all(
      args.updates.map(({ id, position }) => ctx.db.patch(id, { position }))
    );
  },
});

// --- CLEAR COMPLETED Operation ---
export const clearCompletedTodos = mutation({
  handler: async (ctx) => {
    const completedTodos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();

    await Promise.all(completedTodos.map((todo) => ctx.db.delete(todo._id)));
  },
});
