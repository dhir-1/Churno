"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ResultProps {
  data: {
    risk: string
    probability: number
    prediction: number
    threshold: number
    customerID: string
  }
}

const riskConfig = {
  HIGH: {
    emoji: "⚠️",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    glowColor: "shadow-lg shadow-red-500/20",
    badge: "bg-red-500/15 border border-red-500/40",
  },
  MEDIUM: {
    emoji: "⚡",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    glowColor: "shadow-lg shadow-amber-500/20",
    badge: "bg-amber-500/15 border border-amber-500/40",
  },
  LOW: {
    emoji: "✅",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    glowColor: "shadow-lg shadow-emerald-500/20",
    badge: "bg-emerald-500/15 border border-emerald-500/40",
  },
}

export default function PredictionResults({ data }: ResultProps) {
  const config = riskConfig[data.risk as keyof typeof riskConfig]
  const probabilityPercent = (data.probability * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Customer ID */}
      <div className="text-sm text-muted-foreground">
        <span className="text-foreground font-medium">Customer:</span>{" "}
        <span className="font-mono text-accent">{data.customerID}</span>
      </div>

      {/* Three Main Cards Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Risk Level Card */}
        <Card className="border border-border/40 bg-card/40 backdrop-blur-sm hover:border-border/60 transition-theme group">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-56">
            <div className={`text-7xl mb-4 transition-transform group-hover:scale-110 ${config.glowColor}`}>
              {config.emoji}
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Risk Level</p>
            <div className={`${config.badge} px-5 py-2 rounded-lg`}>
              <p className={`text-2xl font-bold ${config.color}`}>{data.risk}</p>
            </div>
          </CardContent>
        </Card>

        {/* Probability Card - Center, Biggest */}
        <Card className="border border-border/40 bg-card/40 backdrop-blur-sm hover:border-border/60 transition-theme">
          <CardContent className="p-6 flex flex-col items-center justify-center h-56">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-semibold">
              Churn Probability
            </p>
            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-border/30"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray={`${data.probability * 283} 283`}
                  className="text-accent transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center z-10">
                <div className="text-5xl font-bold text-accent">{probabilityPercent}%</div>
                <div className="text-xs text-muted-foreground mt-2">Likelihood</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Threshold Card */}
        <Card className="border border-border/40 bg-card/40 backdrop-blur-sm hover:border-border/60 transition-theme">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-56">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-semibold">
              Decision Threshold
            </p>
            <div className="bg-secondary/50 rounded-lg px-6 py-4 border border-border/30 w-full">
              <p className="text-4xl font-bold text-accent">{(data.threshold * 100).toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground mt-3">Cutoff Value</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
