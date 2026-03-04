"use client"

import { useTheme } from "./ThemeProvider"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-secondary border border-border hover:bg-muted transition-all active:scale-95 group"
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
            ) : (
                <Sun className="w-5 h-5 text-primary group-hover:rotate-45 transition-transform" />
            )}
        </button>
    );
}
