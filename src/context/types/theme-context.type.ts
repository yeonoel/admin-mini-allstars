import type { Theme } from "../ThemeContext";

export type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
}