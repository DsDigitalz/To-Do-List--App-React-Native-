// App.tsx
import React from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ConvexProviderWithClerk } from "convex/react"; // Adjust if needed
import { convex } from "./convex"; // Your Convex client instance
import HomeScreen from "./screens/HomeScreen";
import { StatusBar } from "react-native";

const App = () => {
  return (
    <ConvexProviderWithClerk client={convex}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ConvexProviderWithClerk>
  );
};

// Component to use the theme and set status bar style
const AppContent = () => {
  const { theme } = useTheme();

  // Set the status bar style based on the theme
  const barStyle = theme.mode === "dark" ? "light-content" : "dark-content";

  return (
    <>
      <StatusBar
        barStyle={barStyle}
        backgroundColor={theme.colors.background}
      />
      <HomeScreen />
    </>
  );
};

export default App;
