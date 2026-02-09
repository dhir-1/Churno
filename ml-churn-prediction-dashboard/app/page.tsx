"use client"

import { useState, useEffect } from "react"
import ChurnPredictionDashboard from "@/components/churn-dashboard"

export default function Home() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  if (!mounted) return null

  return (
    <div className={isDark ? "dark" : ""}>
      <ChurnPredictionDashboard onThemeToggle={toggleTheme} isDark={isDark} />
    </div>
  )
}
