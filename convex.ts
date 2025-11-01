// convex.ts
import { ConvexReactClient } from "convex/react";
// ⚠️ 1. You MUST import the auto-generated api object
import { api } from "./convex/_generated/api";

// Use your environment variable (correct)
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error("EXPO_PUBLIC_CONVEX_URL is not set!");
}

// 🚀 2. Export the client instance (correct)
export const convex = new ConvexReactClient(convexUrl, {
  // Note: Ensure this is included for RN/Expo compatibility
  storage: (global as any).localStorage,
});

// 🚀 3. You MUST export the api object for your hooks to use
export { api };
