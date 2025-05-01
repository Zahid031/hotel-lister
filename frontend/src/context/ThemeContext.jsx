// import React, { createContext, useState, useEffect, useContext } from 'react';

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   // Check if user has a theme preference in localStorage or prefers dark mode
//   const getInitialTheme = () => {
//     if (typeof window !== 'undefined' && window.localStorage) {
//       const storedPrefs = window.localStorage.getItem('color-theme');
//       if (typeof storedPrefs === 'string') {
//         return storedPrefs;
//       }
      
//       const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
//       if (userMedia.matches) {
//         return 'dark';
//       }
//     }
    
//     return 'light'; // Default theme
//   };
  
//   const [theme, setTheme] = useState(getInitialTheme);
  
//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('color-theme', newTheme);
//   };
  
//   useEffect(() => {
//     const root = window.document.documentElement;
    
//     // Remove the previous theme
//     root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    
//     // Add the current theme
//     root.classList.add(theme);
//   }, [theme]);
  
//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);


// src/context/ThemeContext.jsx
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};