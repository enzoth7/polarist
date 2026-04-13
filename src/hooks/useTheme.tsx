import { createContext, useContext, useEffect, ReactNode } from "react";

type Theme = "light";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const theme: Theme = "light";

    useEffect(() => {
        const root = document.documentElement;
        root.classList.add("light");
        root.classList.remove("dark");
    }, [theme]);

    const toggleTheme = () => {};

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
