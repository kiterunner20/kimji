import React, { useEffect } from 'react';
import { useAppContext } from './AppContext';

// This component will apply the selected theme to the root CSS variables
const ThemeProvider = ({ children }) => {
  const { theme, themes, darkMode } = useAppContext();
  
  useEffect(() => {
    // Get the current theme object
    const currentTheme = themes?.[theme] || themes.default;
    
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--primary', currentTheme.colors.primary);
    document.documentElement.style.setProperty('--primary-dark', currentTheme.colors.secondary);
    document.documentElement.style.setProperty('--primary-light', currentTheme.colors.accent);
    
    // Automatically adjust primary-light opacity for dark mode, needed for some components
    if (darkMode) {
      document.documentElement.style.setProperty('--primary-dark-light', `${currentTheme.colors.secondary}33`);
    } else {
      document.documentElement.style.setProperty('--primary-dark-light', `${currentTheme.colors.secondary}11`);
    }
    
    // Add theme class to body for potential CSS overrides
    document.body.className = darkMode ? `dark-mode theme-${theme}` : `theme-${theme}`;
    
  }, [theme, darkMode, themes]);
  
  return <>{children}</>;
};

export default ThemeProvider; 