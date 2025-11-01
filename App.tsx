// App.tsx
import React from "react";
import { ConvexProvider } from "convex/react";
// import { convex } from "./convex"; // Your client setup file
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import HomeScreen from "./screens/HomeScreen";
import { StatusBar, LogBox } from "react-native";
import { convex } from "./convex";

LogBox.ignoreLogs(['Setting a timer']); // Common RN/Convex warning fix

// The client setup assumes you are using process.env.EXPO_PUBLIC_CONVEX_URL
// If not using Expo, you'd use a cloud URL here.
// import { convex } from "./convex";

const App = () => {
  return (
    <ConvexProvider client={convex}>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
    // </ConvexProvider>
  );
};

// Component to use the theme and set status bar style
const AppContent = () => {
  const { theme } = useTheme();

  const barStyle = theme.mode === "dark" ? "light-content" : "dark-content";

  return (
    <>
      {/* ⚠️ Ensures status bar adapts to theme */}
      <StatusBar
        barStyle={barStyle}
        backgroundColor={theme.colors.background}
      />
      <HomeScreen />
    </>
  );
};

export default App;



// import { View, Text } from 'react-native'
// import React from 'react'

// const App = () => {
//   return (
//     <View>
//       <Text>Apphhhhhh</Text>
//     </View>
//   )
// }

// export default App