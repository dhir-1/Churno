"use client"

export default function FeatureImportanceRadar() {
  const features = [
    { name: "Tenure", value: 0.28 },
    { name: "Monthly Charges", value: 0.22 },
    { name: "Contract Type", value: 0.2 },
    { name: "Tech Support", value: 0.15 },
    { name: "Internet Service", value: 0.12 },
    { name: "Online Security", value: 0.08 },
  ]

  const maxValue = 0.3
  const svgSize = 320

  return (
    <div className="flex justify-center py-4">
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="drop-shadow-sm">
        {/* Grid lines */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((ring, idx) => {
          const radius = (ring * svgSize) / 3
          return (
            <circle
              key={idx}
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              className="text-border/40"
              opacity="0.4"
            />
          )
        })}

        {/* Axes */}
        {features.map((_, idx) => {
          const angle = (idx / features.length) * Math.PI * 2 - Math.PI / 2
          const x2 = svgSize / 2 + Math.cos(angle) * (svgSize / 3)
          const y2 = svgSize / 2 + Math.sin(angle) * (svgSize / 3)
          return (
            <line
              key={`axis-${idx}`}
              x1={svgSize / 2}
              y1={svgSize / 2}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="0.6"
              className="text-border/30"
              opacity="0.3"
            />
          )
        })}

        {/* Data polygon */}
        <polygon
          points={features
            .map((feature, idx) => {
              const angle = (idx / features.length) * Math.PI * 2 - Math.PI / 2
              const radius = (feature.value / maxValue) * (svgSize / 3)
              return [svgSize / 2 + Math.cos(angle) * radius, svgSize / 2 + Math.sin(angle) * radius].join(",")
            })
            .join(" ")}
          fill="rgb(100, 200, 255, 0.15)"
          stroke="rgb(100, 200, 255)"
          strokeWidth="2"
          className="drop-shadow-md"
        />

        {/* Data points */}
        {features.map((feature, idx) => {
          const angle = (idx / features.length) * Math.PI * 2 - Math.PI / 2
          const radius = (feature.value / maxValue) * (svgSize / 3)
          return (
            <circle
              key={`point-${idx}`}
              cx={svgSize / 2 + Math.cos(angle) * radius}
              cy={svgSize / 2 + Math.sin(angle) * radius}
              r="4"
              fill="rgb(100, 200, 255)"
              className="drop-shadow-sm"
            />
          )
        })}

        {/* Labels */}
        {features.map((feature, idx) => {
          const angle = (idx / features.length) * Math.PI * 2 - Math.PI / 2
          const labelRadius = svgSize / 3 + 35
          return (
            <text
              key={`label-${idx}`}
              x={svgSize / 2 + Math.cos(angle) * labelRadius}
              y={svgSize / 2 + Math.sin(angle) * labelRadius}
              textAnchor="middle"
              dy="0.3em"
              className="text-xs fill-muted-foreground font-medium"
            >
              {feature.name}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
