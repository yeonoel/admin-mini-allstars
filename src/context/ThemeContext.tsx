import { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeContextType } from './types/theme-context.type';
import type { ThemeProviderProps } from './interfaces/theme-provider-props';

export type Theme = 'light' | 'dark';


export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider component.
 * This component wraps the application and provides the theme context.
 * It also sets the theme in local storage and updates the document's
 * class list to reflect the current theme.
 *
 * @param {ThemeProviderProps} props - The props for the ThemeProvider component.
 * @returns {JSX.Element} - The ThemeProvider component.
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(() => {
        /**
         * Get the saved theme from local storage or default to 'light' if
         * no saved theme is found.
         */
        const savedTheme = localStorage.getItem('theme') as Theme;
        return savedTheme || 'light';
    });

    /**
     * useEffect hook to update the document's class list and local storage
     * whenever the theme changes.
     */
    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    /**
     * Toggle theme function.
     * This function toggles the theme between 'light' and 'dark'.
     */
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
