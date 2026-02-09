"use client"

interface RiskGaugeProps {
  probability: number
}

export default function RiskGauge({ probability }: RiskGaugeProps) {
  const percentage = probability * 100

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <svg width="220" height="140" viewBox="0 0 220 140" className="mb-6">
        {/* Background arc */}
        <path
          d="M 40 120 A 80 80 0 0 1 180 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="13"
          className="text-border/30"
        />

        {/* Green zone (0-50) */}
        <path
          d="M 40 120 A 80 80 0 0 1 110 48"
          fill="none"
          stroke="rgb(34, 197, 94)"
          strokeWidth="13"
          strokeLinecap="round"
          className="drop-shadow-md"
        />

        {/* Yellow zone (50-75) */}
        <path
          d="M 110 48 A 80 80 0 0 1 160 90"
          fill="none"
          stroke="rgb(234, 179, 8)"
          strokeWidth="13"
          strokeLinecap="round"
          className="drop-shadow-md"
        />

        {/* Red zone (75-100) */}
        <path
          d="M 160 90 A 80 80 0 0 1 180 120"
          fill="none"
          stroke="rgb(239, 68, 68)"
          strokeWidth="13"
          strokeLinecap="round"
          className="drop-shadow-md"
        />

        {/* Needle */}
        <g transform={`rotate(${(percentage / 100) * 180 - 90} 110 120)`}>
          <line
            x1="110"
            y1="120"
            x2="110"
            y2="50"
            stroke="rgb(59, 130, 246)"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="drop-shadow-sm"
          />
        </g>

        {/* Center circle */}
        <circle cx="110" cy="120" r="7" fill="rgb(59, 130, 246)" className="drop-shadow-md" />
      </svg>

      <div className="text-center">
        <div className="text-4xl font-bold text-accent">{percentage.toFixed(1)}%</div>
        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider font-semibold">Churn Risk</p>
      </div>
    </div>
  )
}
