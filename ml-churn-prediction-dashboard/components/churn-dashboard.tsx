"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import ChurnForm from "./churn-form"
import PredictionResults from "./prediction-results"
import ExplainabilitySection from "./explainability-section"
import { Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react"

interface ChurnData {
  customerID: string
  probability: number
  prediction: number
  risk: "HIGH" | "MEDIUM" | "LOW"
  threshold: number
  topFactors: Array<{
    name: string
    impact: number
    direction: "positive" | "negative"
  }>
}

interface ChurnDashboardProps {
  onThemeToggle: () => void
  isDark: boolean
}

export default function ChurnPredictionDashboard({ onThemeToggle, isDark }: ChurnDashboardProps) {
  const [isFormOpen, setIsFormOpen] = useState(true)
  const { control } = useForm()

  // Sample prediction data
  const [predictionData] = useState<ChurnData>({
    customerID: "CUST-2024-8834",
    probability: 0.782,
    prediction: 1,
    risk: "HIGH",
    threshold: 0.5,
    topFactors: [
      { name: "Month-to-month contract", impact: 0.34, direction: "negative" },
      { name: "Short tenure (3 months)", impact: 0.28, direction: "negative" },
      { name: "No tech support", impact: 0.22, direction: "negative" },
      { name: "High monthly charges", impact: 0.18, direction: "negative" },
      { name: "No fiber optic service", impact: 0.15, direction: "negative" },
    ],
  })

  return (
    <div className="min-h-screen bg-background transition-theme">
      <div className="flex h-screen overflow-hidden">
        {/* Left Sidebar - Collapsible Form */}
        <div
          className={`transition-all duration-300 overflow-hidden bg-card border-r border-border flex flex-col ${
            isFormOpen ? "w-96" : "w-0"
          }`}
        >
          <ChurnForm control={control} />
        </div>

        {/* Right Content - Full height dashboard */}
        <div className="flex-1 overflow-auto flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm transition-theme">
            <div className="flex items-center justify-between px-8 py-4">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-theme text-sm font-medium"
                >
                  {isFormOpen ? (
                    <>
                      <ChevronLeft className="w-4 h-4" />
                      Hide Form
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      Show Form
                    </>
                  )}
                </button>
              </div>

              {/* Right Section - Title and Theme Toggle */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <h1 className="text-lg font-bold text-foreground">Churn Prediction</h1>
                  <p className="text-xs text-muted-foreground">ML Risk Assessment</p>
                </div>
                <button
                  onClick={onThemeToggle}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-theme text-foreground"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-8">
            {/* Main Results Section */}
            <div className="grid gap-6 mb-8">
              <PredictionResults data={predictionData} />
            </div>

            {/* Explainability Section */}
            <div>
              <ExplainabilitySection data={predictionData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
