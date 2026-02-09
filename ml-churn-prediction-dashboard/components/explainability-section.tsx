"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FactorImpactBars from "./factor-impact-bars"
import FeatureImportanceRadar from "./feature-importance-radar"
import RiskGauge from "./risk-gauge"
import TenureVsChurnScatter from "./tenure-vs-churn-scatter"
import ServiceBundleHeatmap from "./service-bundle-heatmap"
import CustomerJourneyTimeline from "./customer-journey-timeline"

interface ExplainabilitySectionProps {
  data: {
    probability: number
    topFactors: Array<{
      name: string
      impact: number
      direction: "positive" | "negative"
    }>
  }
}

export default function ExplainabilitySection({ data }: ExplainabilitySectionProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Why this prediction?</h2>
        <p className="text-sm text-muted-foreground">
          Model explainability through feature importance and impact analysis
        </p>
      </div>

      {/* Top 5 Impact Factors - Horizontal Scroll */}
      <Card className="glass border-border/20 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Top 5 Impact Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <FactorImpactBars factors={data.topFactors} />
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance Radar */}
        <Card className="glass border-border/20">
          <CardHeader>
            <CardTitle className="text-base">Feature Importance</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureImportanceRadar />
          </CardContent>
        </Card>

        {/* Risk Gauge */}
        <Card className="glass border-border/20">
          <CardHeader>
            <CardTitle className="text-base">Risk Gauge</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskGauge probability={data.probability} />
          </CardContent>
        </Card>

        {/* Tenure vs Churn */}
        <Card className="glass border-border/20">
          <CardHeader>
            <CardTitle className="text-base">Tenure vs Churn Probability</CardTitle>
          </CardHeader>
          <CardContent>
            <TenureVsChurnScatter />
          </CardContent>
        </Card>

        {/* Service Bundle Heatmap */}
        <Card className="glass border-border/20">
          <CardHeader>
            <CardTitle className="text-base">Service Bundle Churn Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceBundleHeatmap />
          </CardContent>
        </Card>
      </div>

      {/* Customer Journey Timeline */}
      <Card className="glass border-border/20">
        <CardHeader>
          <CardTitle className="text-base">Customer Journey Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerJourneyTimeline />
        </CardContent>
      </Card>
    </div>
  )
}
