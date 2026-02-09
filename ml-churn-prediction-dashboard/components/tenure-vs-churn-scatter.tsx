"use client"

export default function TenureVsChurnScatter() {
  // Generate sample scatter data
  const data = [
    { tenure: 1, churn: 0.85 },
    { tenure: 2, churn: 0.78 },
    { tenure: 3, churn: 0.72 },
    { tenure: 6, churn: 0.55 },
    { tenure: 12, churn: 0.35 },
    { tenure: 24, churn: 0.18 },
    { tenure: 36, churn: 0.12 },
    { tenure: 48, churn: 0.08 },
    { tenure: 60, churn: 0.05 },
  ]

  const maxTenure = 60
  const maxChurn = 1

  return (
    <div className="flex justify-center py-4">
      <svg width="300" height="240" viewBox="0 0 300 240" className="drop-shadow-sm">
        {/* Grid background */}
        <rect width="300" height="240" fill="transparent" />

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = 200 - ratio * 180
          return (
            <line
              key={`hgrid-${ratio}`}
              x1="30"
              y1={y}
              x2="280"
              y2={y}
              stroke="currentColor"
              strokeWidth="0.6"
              className="text-border/20"
              opacity="0.4"
            />
          )
        })}

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const x = 30 + ratio * 250
          return (
            <line
              key={`vgrid-${ratio}`}
              x1={x}
              y1="20"
              x2={x}
              y2="200"
              stroke="currentColor"
              strokeWidth="0.6"
              className="text-border/20"
              opacity="0.4"
            />
          )
        })}

        {/* Axes */}
        <line
          x1="30"
          y1="200"
          x2="280"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border/40"
          opacity="0.5"
        />
        <line
          x1="30"
          y1="20"
          x2="30"
          y2="200"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border/40"
          opacity="0.5"
        />

        {/* Trend line */}
        <polyline
          points={data.map((d) => `${30 + (d.tenure / maxTenure) * 250},${200 - (d.churn / maxChurn) * 180}`).join(" ")}
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2.5"
          opacity="0.6"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />

        {/* Data points */}
        {data.map((d, idx) => (
          <circle
            key={idx}
            cx={30 + (d.tenure / maxTenure) * 250}
            cy={200 - (d.churn / maxChurn) * 180}
            r="3.5"
            fill="rgb(59, 130, 246)"
            className="drop-shadow-md"
            opacity="0.85"
          />
        ))}

        {/* Axes labels */}
        <text x="155" y="225" textAnchor="middle" className="text-xs fill-muted-foreground font-medium">
          Tenure (months)
        </text>
        <text
          x="12"
          y="110"
          textAnchor="middle"
          transform="rotate(-90 12 110)"
          className="text-xs fill-muted-foreground font-medium"
        >
          Churn Probability
        </text>
      </svg>
    </div>
  )
}
