import { useState, useEffect } from 'react';
import { getAnalytics } from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Users, AlertTriangle } from 'lucide-react';

export default function AnalyticsDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAnalytics();
                setData(res);
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-[var(--text-secondary)]">Loading analytics...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

    const COLORS = ['#ef4444', '#f59e0b', '#10b981']; // Red, Amber, Green

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Analytics Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-[var(--text-secondary)]">Total Predictions</p>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">{data.total_predictions}</p>
                    </div>
                </div>
                <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-[var(--text-secondary)]">Average Risk Score</p>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">{(data.avg_risk * 100).toFixed(1)}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Risk Distribution Chart */}
                <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Risk Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.risk_distribution}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.risk_distribution.map((entry, index) => {
                                        // Map logic: High -> Red, Medium -> Amber, Low -> Green matches COLORS index if sorted correctly or matched by name
                                        // Simple map for MVP
                                        let color = '#10b981';
                                        if (entry.name === 'High') color = '#ef4444';
                                        if (entry.name === 'Medium') color = '#f59e0b';
                                        return <Cell key={`cell-${index}`} fill={color} />;
                                    })}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-sm text-[var(--text-secondary)]">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> High Risk</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Medium Risk</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Low Risk</div>
                    </div>
                </div>

                {/* Trends Chart */}
                <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Activity (Last 7 Days)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.trends}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
                                <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                                <Area type="monotone" dataKey="count" stroke="var(--accent-color)" fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
