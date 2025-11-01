import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// --- Schema Definition (Optional, but good practice) ---
// Define the structure of a Todo item in the Convex database
export const todoSchema = {
    title: v.string(),
    description: v.optional(v.string()),
    isCompleted: v.boolean(),
    dueDate: v.optional(v.number()), // Storing date as a timestamp
    createdAt: v.number(),
    // We'll use the built-in system fields for sorting later, but 
    // adding a manual sortable index is also common for custom order.
};

// --- READ Operation (Real-time Query) ---
/**
 * Fetches all todos, sorted by creation date (newest first).
 * Convex queries are reactive, giving you the real-time experience.
 */
export const getTodos = query({
    args: {
        // We can pass arguments here to implement filtering later (e.g., active/completed)
        filter: v.optional(v.union(v.literal("all"), v.literal("active"), v.literal("completed"))),
    },
    handler: async (ctx, args) => {
        let todos = await ctx.db
            .query("todos") // Query the 'todos' table
            .order("desc")  // Order by insertion time (implicitly the newest)
            .collect();     // Collect all results

        // Simple filtering logic based on the requested filter
        if (args.filter === "active") {
            todos = todos.filter(todo => !todo.isCompleted);
        } else if (args.filter === "completed") {
            todos = todos.filter(todo => todo.isCompleted);
        }

        // Return the filtered list
        return todos;
    },
});

// --- CREATE Operation (Example Mutation) ---
/**
 * Adds a new todo item to the database.
 */
export const createTodo = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        dueDate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const todoId = await ctx.db.insert("todos", {
            title: args.title,
            description: args.description,
            isCompleted: false, // Always start as incomplete
            dueDate: args.dueDate,
            createdAt: Date.now(),
        });
        return todoId;
    },
});

// *Other CRUD mutations (update, delete) would be defined here.*