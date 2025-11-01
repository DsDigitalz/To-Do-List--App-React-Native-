// App.tsx
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ConvexProviderWithClerk } from 'convex/react'; // or equivalent setup
import { convex } from './convex'; // Your convex client instance
import HomeScreen from './screens/HomeScreen';
import { StatusBar } from 'react-native';

const App = () => {
  return (
    <ConvexProviderWithClerk client={convex} use} /* Replace with your actual Convex setup */ >
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
  const barStyle = theme.mode === 'dark' ? 'light-content' : 'dark-content';
  
  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor={theme.colors.background} />
      <HomeScreen /> 
    </>
  );
};

export default App;