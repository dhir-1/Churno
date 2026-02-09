"use client"

export default function CustomerJourneyTimeline() {
  const timeline = [
    { month: 0, probability: 0.85, label: "Signup" },
    { month: 3, probability: 0.72, label: "3mo" },
    { month: 6, probability: 0.58, label: "6mo" },
    { month: 12, probability: 0.35, label: "1yr" },
    { month: 24, probability: 0.18, label: "2yr" },
    { month: 36, probability: 0.12, label: "3yr" },
  ]

  const width = 640
  const height = 180
  const margin = { top: 20, right: 30, bottom: 50, left: 50 }
  const graphWidth = width - margin.left - margin.right
  const graphHeight = height - margin.top - margin.bottom

  const maxMonth = 36
  const maxProb = 1

  return (
    <div className="flex justify-center overflow-x-auto py-4">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="drop-shadow-sm">
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={`grid-${ratio}`}
            x1={margin.left}
            y1={margin.top + (1 - ratio) * graphHeight}
            x2={width - margin.right}
            y2={margin.top + (1 - ratio) * graphHeight}
            stroke="currentColor"
            strokeWidth="0.6"
            className="text-border/20"
            opacity="0.3"
          />
        ))}

        {/* Axes */}
        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke="currentColor"
          strokeWidth="1"
          className="text-border/40"
          opacity="0.5"
        />
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height - margin.bottom}
          stroke="currentColor"
          strokeWidth="1"
          className="text-border/40"
          opacity="0.5"
        />

        {/* Trend line */}
        <polyline
          points={timeline
            .map(
              (d) =>
                `${margin.left + (d.month / maxMonth) * graphWidth},${
                  height - margin.bottom - (d.probability / maxProb) * graphHeight
                }`,
            )
            .join(" ")}
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth="3"
          strokeLinecap="round"
          className="drop-shadow-md"
          opacity="0.8"
        />

        {/* Data points */}
        {timeline.map((d, idx) => (
          <g key={idx}>
            <circle
              cx={margin.left + (d.month / maxMonth) * graphWidth}
              cy={height - margin.bottom - (d.probability / maxProb) * graphHeight}
              r="4.5"
              fill="rgb(59, 130, 246)"
              className="drop-shadow-md"
              opacity="0.9"
            />
            {/* Labels */}
            <text
              x={margin.left + (d.month / maxMonth) * graphWidth}
              y={height - margin.bottom + 28}
              textAnchor="middle"
              className="text-xs fill-muted-foreground font-medium"
            >
              {d.label}
            </text>
          </g>
        ))}

        {/* Y-axis label */}
        <text
          x="15"
          y={margin.top + graphHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90 15 ${margin.top + graphHeight / 2})`}
          className="text-xs fill-muted-foreground font-medium"
        >
          Churn Probability
        </text>
      </svg>
    </div>
  )
}
