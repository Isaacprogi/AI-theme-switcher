import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Theme } from '../types';
import { GroqThemeService } from '../services/grokService';

interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  setCurrentTheme: (theme: Theme) => void; // Add this line
  generateNewTheme: (prompt: string) => Promise<{ success: boolean; message?: string }>;
  isLoading: boolean;
  error: string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultThemes: Theme[] = [
  {
    id: 'default',
    name: 'Ocean Blue',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#60A5FA',
      background: '#FFFFFF',
      text: '#1F2937'
    }
  },
  {
    id: 'forest',
    name: 'Forest Green',
    colors: {
      primary: '#10B981',
      secondary: '#047857',
      accent: '#34D399',
      background: '#F9FAFB',
      text: '#1F2937'
    }
  }
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themes, setThemes] = useState<Theme[]>(defaultThemes);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    applyThemeToDOM(currentTheme);
  }, [currentTheme]);

  const applyThemeToDOM = (theme: Theme) => {
    console.log('Applying theme:', theme.name); // Debug log
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  };

  // Function to handle theme selection
  const handleThemeChange = (theme: Theme) => {
    console.log('Changing theme to:', theme.name); // Debug log
    setCurrentTheme(theme);
  };

  const generateNewTheme = async (prompt: string): Promise<{ success: boolean; message?: string }> => {
    if (!prompt.trim()) {
      setError('Please enter a theme description');
      return { success: false, message: 'Please enter a theme description' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const newColors = await GroqThemeService.generateTheme(prompt);
      
      const newTheme: Theme = {
        id: `ai-${Date.now()}`,
        name: prompt.charAt(0).toUpperCase() + prompt.slice(1),
        colors: newColors
      };
      
      setThemes(prev => [...prev, newTheme]);
      setCurrentTheme(newTheme);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate theme';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      themes, 
      setCurrentTheme: handleThemeChange, // Expose the theme change function
      generateNewTheme, 
      isLoading,
      error 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};