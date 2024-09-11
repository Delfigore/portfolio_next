import { useState, useEffect } from 'react'

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState<boolean | null>(null)

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true'
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

    // Check if there's a saved preference, otherwise use system preference
    if (localStorage.getItem('darkMode') !== null) {
      setDarkMode(isDarkMode)
    } else {
      setDarkMode(prefersDarkMode)
      localStorage.setItem('darkMode', prefersDarkMode.toString())
    }
  }, [])

  useEffect(() => {
    if (darkMode !== null) {
      document.documentElement.classList.toggle('dark', darkMode)
      localStorage.setItem('darkMode', darkMode.toString())
    }
  }, [darkMode])

  return [darkMode, setDarkMode] as const
}