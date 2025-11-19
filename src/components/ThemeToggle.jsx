import React, { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import styles from '../styles/components/themetoggle.module.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <div className={styles.toggleContainer}>
      <button className={styles.themeToggleBtn} onClick={toggleTheme}>
        <span className={styles.themeIcon}>
          {theme === 'light' ? '🌙' : '☀️'}
        </span>
        <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
      </button>
    </div>
  )
}
