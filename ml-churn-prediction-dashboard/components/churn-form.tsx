"use client"

import { useForm } from "react-hook-form"

interface ChurnFormProps {
  control: any
}

const formSections = [
  {
    title: "Customer Info",
    icon: "👤",
    fields: ["customerID", "gender", "seniorCitizen", "partner"],
  },
  {
    title: "Services",
    icon: "📱",
    fields: ["phoneService", "internetService", "onlineSecurity", "techSupport"],
  },
  {
    title: "Account",
    icon: "📋",
    fields: ["tenure", "contractType", "paymentMethod", "paperlessBilling"],
  },
  {
    title: "Charges",
    icon: "💰",
    fields: ["monthlyCharges", "totalCharges", "chargesLastQuarter"],
  },
]

export default function ChurnForm({ control }: ChurnFormProps) {
  const { register } = useForm()

  return (
    <div className="h-full overflow-y-auto flex flex-col bg-card">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-card to-card/80 backdrop-blur px-6 py-5 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Customer Data</h2>
        <p className="text-xs text-muted-foreground mt-2">20 fields across 4 categories</p>
      </div>

      {/* Form Sections */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {formSections.map((section) => (
          <div key={section.title} className="space-y-3">
            {/* Section Header with Icon */}
            <div className="flex items-center gap-2">
              <span className="text-lg">{section.icon}</span>
              <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">{section.title}</h3>
            </div>

            {/* Form Fields */}
            <div className="space-y-2 pl-4 border-l-2 border-accent/30">
              {section.fields.map((field) => (
                <div key={field} className="group">
                  <input
                    {...register(field)}
                    type="text"
                    placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                    className="w-full px-3 py-2 text-xs bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-theme hover:border-border/80"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 bg-gradient-to-t from-card to-card/80 backdrop-blur px-6 py-5 border-t border-border">
        <button className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/20 transition-theme text-sm">
          Run Prediction
        </button>
      </div>
    </div>
  )
}
