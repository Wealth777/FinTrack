import React, { useState, useEffect, createContext } from 'react'

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {

    const [theme, setTheme] = useState('light')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('theme')
        const themeToSet = saved || 'light'

        setTheme(themeToSet)
        document.documentElement.setAttribute('data-theme', themeToSet)
        document.documentElement.style.colorScheme = themeToSet
        

        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('theme', theme);
            document.documentElement.setAttribute('data-theme', theme)
            document.documentElement.style.colorScheme = theme
        }
    }, [theme, mounted])

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === "light" ? "dark" : "light"
            return newTheme
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
