"use client"

export default function ServiceBundleHeatmap() {
  const services = ["Phone Service", "Internet Fiber", "Online Security", "Tech Support", "Streaming TV"]
  const bundles = ["Single", "Dual", "Triple", "4+"]

  // Churn risk matrix (0-1)
  const riskMatrix = [
    [0.75, 0.65, 0.45, 0.28],
    [0.82, 0.72, 0.52, 0.32],
    [0.65, 0.55, 0.38, 0.22],
    [0.78, 0.68, 0.48, 0.25],
    [0.7, 0.6, 0.4, 0.2],
  ]

  const getColor = (value: number) => {
    if (value > 0.7) return "rgb(239, 68, 68)"
    if (value > 0.5) return "rgb(234, 179, 8)"
    if (value > 0.3) return "rgb(59, 130, 246)"
    return "rgb(34, 197, 94)"
  }

  const cellWidth = 50
  const cellHeight = 38
  const labelWidth = 150

  return (
    <div className="overflow-x-auto py-2">
      <svg
        width={labelWidth + bundles.length * cellWidth + 30}
        height={services.length * cellHeight + 50}
        viewBox={`0 0 ${labelWidth + bundles.length * cellWidth + 30} ${services.length * cellHeight + 50}`}
        className="drop-shadow-sm"
      >
        {/* Column headers */}
        {bundles.map((bundle, idx) => (
          <g key={`header-${idx}`}>
            <rect
              x={labelWidth + idx * cellWidth}
              y="0"
              width={cellWidth}
              height="30"
              fill="currentColor"
              className="text-secondary/20"
              rx="4"
            />
            <text
              x={labelWidth + idx * cellWidth + cellWidth / 2}
              y="20"
              textAnchor="middle"
              className="text-xs font-semibold fill-foreground"
            >
              {bundle} Service
            </text>
          </g>
        ))}

        {/* Row labels and cells */}
        {services.map((service, serviceIdx) => (
          <g key={`row-${serviceIdx}`}>
            {/* Row label */}
            <text
              x="10"
              y={50 + serviceIdx * cellHeight + cellHeight / 2 + 2}
              textAnchor="start"
              dy="0.3em"
              className="text-xs font-medium fill-foreground"
            >
              {service}
            </text>

            {/* Cells */}
            {bundles.map((_, bundleIdx) => {
              const value = riskMatrix[serviceIdx][bundleIdx]
              return (
                <g key={`cell-${serviceIdx}-${bundleIdx}`}>
                  <rect
                    x={labelWidth + bundleIdx * cellWidth + 2}
                    y={50 + serviceIdx * cellHeight + 2}
                    width={cellWidth - 4}
                    height={cellHeight - 4}
                    fill={getColor(value)}
                    opacity="0.75"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    className="text-border/40"
                    rx="4"
                  />
                  <text
                    x={labelWidth + bundleIdx * cellWidth + cellWidth / 2}
                    y={50 + serviceIdx * cellHeight + cellHeight / 2 + 1}
                    textAnchor="middle"
                    dy="0.3em"
                    className="text-xs font-bold fill-white"
                  >
                    {(value * 100).toFixed(0)}%
                  </text>
                </g>
              )
            })}
          </g>
        ))}
      </svg>
    </div>
  )
}
