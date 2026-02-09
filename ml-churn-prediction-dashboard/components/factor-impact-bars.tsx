"use client"

interface Factor {
  name: string
  impact: number
  direction: "positive" | "negative"
}

interface FactorImpactBarsProps {
  factors: Factor[]
}

export default function FactorImpactBars({ factors }: FactorImpactBarsProps) {
  return (
    <div className="space-y-5">
      {factors.map((factor, idx) => (
        <div key={idx} className="group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{factor.direction === "negative" ? "📉" : "📈"}</span>
              <span className="font-medium text-foreground text-sm">{factor.name}</span>
            </div>
            <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded">
              {(factor.impact * 100).toFixed(0)}%
            </span>
          </div>
          <div className="h-2.5 bg-secondary/40 rounded-full overflow-hidden border border-border/20">
            <div
              className={`h-full transition-all duration-500 ${
                factor.direction === "negative"
                  ? "bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 shadow-sm shadow-red-500/30"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 shadow-sm shadow-emerald-500/30"
              }`}
              style={{ width: `${factor.impact * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
