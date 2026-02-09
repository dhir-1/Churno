import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { Sparkles, Zap, AlertTriangle, CheckCircle, TrendingUp, Info } from 'lucide-react';

const COLORS = {
    brand: '#f43f5e',
    success: '#10b981',
    text: '#64748b',
    grid: '#e2e8f0',
    tooltipBg: '#ffffff',
    tooltipBorder: '#e2e8f0'
};



export default function ExplainabilitySection({ inputs, result }) {
    // 🧠 Enhanced AI Engine
    const generateInsights = () => {
        const tips = [];
        const risk = result?.churn_probability || 0;

        if (!inputs) return { tips: [], main: "No data available." };

        // 1. Contract & Billing Logic (The "Why")
        if (inputs.Contract === 'Month-to-month') {
            tips.push({
                type: 'critical',
                title: "Contract Vulnerability",
                cause: "Month-to-month contracts have the highest turnover rate because customers are not committed.",
                action: "Incentivize a switch to a 1-Year Contract by offering a 15% monthly discount for the first 3 months."
            });
        }

        // 2. Internet Infrastructure
        if (inputs.InternetService === 'Fiber optic') {
            tips.push({
                type: 'warning',
                title: "Fiber Optic Dissatisfaction",
                cause: "High churn in Fiber users often indicates technical instability or pricing dissatisfaction.",
                action: "Check signal quality logs for this user. Offer a free speed upgrade or router check."
            });
        }

        // 3. Payment Friction
        if (inputs.PaymentMethod === 'Electronic check') {
            tips.push({
                type: 'opportunity',
                title: "Payment Friction",
                cause: "Manual payments (Checks) lead to missed bills and involuntary churn.",
                action: "Enable Auto-Pay to secure revenue. Offer a $5 one-time credit for enrollment."
            });
        }

        // 4. Tenure & Loyalty
        if (inputs.tenure < 12) {
            tips.push({
                type: 'info',
                title: "Onboarding Risk",
                cause: "Customer is within the 'danger zone' (first year). They haven't formed a habit yet.",
                action: "Send 'Welcome Series' emails highlighting hidden features of their plan."
            });
        }

        // Summary
        let mainSummary = "";
        if (risk > 0.7) {
            mainSummary = "High Churn Probability detected. This customer shows strong signals of leaving due to Pricing Sensitivity and Contract Lack of Commitment.";
        } else if (risk > 0.4) {
            mainSummary = "Medium Risk. The customer is stable but shows signs of price fatigue. Proactive engagement is recommended.";
        } else {
            mainSummary = "Low Risk. Highly loyal profile. Focus on Upselling premium services rather than retention.";
        }

        return { tips: tips.slice(0, 4), main: mainSummary };
    };

    const { tips, main } = generateInsights();

    const chartData = result?.insights?.factors || [];
    const radarData = result?.insights?.persona || [];

    return (
        <div className="space-y-8 mt-8">

            {/* charts Section (Moved to Top) */}
            <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                    <TrendingUp size={24} className="text-[var(--accent-color)]" />
                    Technical Behavior Analysis
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card-premium p-6">
                        <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase mb-6">Top Churn Factors</h4>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} horizontal={false} />
                                    <XAxis type="number" stroke={COLORS.text} fontSize={10} />
                                    <YAxis dataKey="name" type="category" stroke={COLORS.text} width={90} fontSize={11} />
                                    <Tooltip contentStyle={{ borderRadius: '8px' }} cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.value > 0 ? COLORS.brand : COLORS.success} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card-premium p-6">
                        <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase mb-2">Customer Persona</h4>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart outerRadius={90} data={radarData}>
                                    <PolarGrid stroke={COLORS.grid} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: COLORS.text, fontSize: 11 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={COLORS.grid} />
                                    <Radar name="Customer" dataKey="A" stroke={COLORS.brand} fill={COLORS.brand} fillOpacity={0.3} />
                                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✨ AI Analysis (Moved to Bottom) */}
            <div className="card p-0 overflow-hidden border border-[var(--border-color)] shadow-xl relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--accent-color)] to-purple-600"></div>

                <div className="p-6 bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[var(--accent-color)] rounded-lg text-white shadow-lg shadow-[var(--accent-color)]/20">
                            <Sparkles size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)]"> Strategic Recommendations</h3>
                    </div>
                    <p className="text-[var(--text-secondary)] ml-14">
                        Based on behavior patterns, here is the detailed breakdown of risks and recommended actions.
                    </p>
                </div>

                <div className="p-8 space-y-8 bg-[var(--bg-card)]">
                    {/* Main Insight */}
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
                        <h4 className="text-sm font-bold uppercase text-[var(--text-secondary)] mb-2">Executive Summary</h4>
                        <p className="text-lg font-medium text-[var(--text-primary)] leading-relaxed">
                            {main}
                        </p>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tips.map((tip, i) => (
                            <div key={i} className="group relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 group-hover:bg-[var(--accent-color)] transition-colors rounded-full"></div>
                                <div className="pl-6 py-2">
                                    <h5 className={`font-bold mb-1 flex items-center gap-2
                                    ${tip.type === 'critical' ? 'text-red-500' :
                                            tip.type === 'warning' ? 'text-amber-500' : 'text-blue-500'}
                                `}>
                                        {tip.title}
                                    </h5>
                                    <div className="space-y-2">
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            <span className="font-semibold text-[var(--text-primary)]">Observation:</span> {tip.cause}
                                        </p>
                                        <p className="text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)]/50 p-2 rounded border border-[var(--border-color)]">
                                            <span className="font-bold text-[var(--accent-color)]">Suggestion:</span> {tip.action}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
