import { Activity, BarChart2, PieChart, FileText } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
    const menuItems = [
        { id: 'predict', label: 'Prediction', icon: <Activity size={20} /> },
        { id: 'analytics', label: 'Analytics', icon: <PieChart size={20} /> },
        { id: 'batch', label: 'Batch Prediction', icon: <FileText size={20} /> },
        { id: 'history', label: 'History', icon: <BarChart2 size={20} /> },
    ];

    return (
        <div className="w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] h-screen flex flex-col transition-all duration-300 shadow-sm z-50">
            <div className="p-8 pb-4">
                <h1 className="text-2xl font-black tracking-tight text-[var(--accent-color)] flex items-center gap-3">
                    <span className="p-2 bg-[var(--accent-subtle)] rounded-lg">
                        <Activity size={24} className="text-[var(--accent-color)]" />
                    </span>
                    CHURNO
                </h1>
                <p className="mt-2 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest pl-1">
                    Analytics Suite
                </p>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`group flex items-center space-x-3 w-full px-4 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm
                    ${activeTab === item.id
                                ? 'bg-[var(--accent-subtle)] text-[var(--accent-color)] shadow-sm'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                        <span className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                        {activeTab === item.id && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />
                        )}
                    </button>
                ))}
            </nav>

        </div>
    );
}
