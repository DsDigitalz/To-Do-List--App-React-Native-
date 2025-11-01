// context/ThemeContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LightTheme, DarkTheme, ThemeType } from "../theme/light";
import { useColorScheme } from "react-native";

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
}

const defaultContext: ThemeContextProps = {
  theme: LightTheme,
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextProps>(defaultContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme(); // 'light' or 'dark'
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(LightTheme);

  // Load persisted theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("userTheme");
        if (storedTheme === "dark") {
          setCurrentTheme(DarkTheme);
        } else if (storedTheme === "light") {
          setCurrentTheme(LightTheme);
        } else {
          // Fallback to system preference if no stored preference
          setCurrentTheme(systemScheme === "dark" ? DarkTheme : LightTheme);
        }
      } catch (e) {
        console.error("Failed to load theme preference", e);
      }
    };
    loadTheme();
  }, [systemScheme]);

  const toggleTheme = async () => {
    const newTheme = currentTheme.mode === "light" ? DarkTheme : LightTheme;
    setCurrentTheme(newTheme);
    await AsyncStorage.setItem("userTheme", newTheme.mode); // Persist
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy access
export const useTheme = () => useContext(ThemeContext);
