import { AlertCircle, CheckCircle } from 'lucide-react';

export default function PredictionResults({ data }) {
    const isHighRisk = data.risk === 'HIGH';
    const colorClass = isHighRisk ? 'text-rose-500' : 'text-emerald-500';
    const bgClass = isHighRisk ? 'bg-rose-50' : 'bg-emerald-50';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* Card 1: Risk Outcome */}
            <div className="card p-6 flex flex-col items-center justify-center text-center">
                <div className={`p-4 rounded-full mb-4 ${bgClass}`}>
                    {isHighRisk ? <AlertCircle size={32} className="text-rose-600" /> : <CheckCircle size={32} className="text-emerald-600" />}
                </div>
                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Churn Risk</p>
                <h3 className={`text-3xl font-bold mt-1 ${colorClass}`}>{data.risk}</h3>
            </div>

            {/* Card 2: Probability */}
            <div className="card p-6 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Probability</p>
                <div className="relative mt-4 mb-2">
                    <svg className="w-32 h-16 overflow-visible">
                        {/* Gauge Arc Background */}
                        <path d="M 10 70 A 50 50 0 0 1 118 70" fill="none" class="stroke-gray-200 dark:stroke-gray-700" strokeWidth="12" strokeLinecap="round" />
                        {/* Gauge Arc Value */}
                        <path
                            d="M 10 70 A 50 50 0 0 1 118 70"
                            fill="none"
                            stroke={isHighRisk ? '#f43f5e' : '#10b981'}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray="170"
                            strokeDashoffset={170 - (170 * data.churn_probability)}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute top-8 left-0 right-0 text-center">
                        <span className="text-2xl font-bold text-[var(--text-primary)]">{(data.churn_probability * 100).toFixed(1)}%</span>
                    </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">Confidence Score</p>
            </div>

            {/* Card 3: Model Logic */}
            <div className="card p-6 flex flex-col justify-center">
                <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">Why this result?</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[var(--text-secondary)]">Contract Impact</span>
                        <span className="font-medium text-[var(--text-primary)]">High</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full">
                        <div className="bg-[var(--accent-color)] h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>

                    <div className="flex justify-between items-center text-sm mt-3">
                        <span className="text-[var(--text-secondary)]">Charges Sensitivity</span>
                        <span className="font-medium text-[var(--text-primary)]">Medium</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full">
                        <div className="bg-purple-400 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
