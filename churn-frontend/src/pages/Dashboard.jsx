import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PredictionForm from '../components/PredictionForm';
import PredictionResults from '../components/PredictionResults';
import ExplainabilitySection from '../components/ExplainabilitySection';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import BatchPrediction from '../components/BatchPrediction';
import History from './History';
import { Sun, Moon, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('predict');
    const [result, setResult] = useState(null);
    const [currentInputs, setCurrentInputs] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);

    // Auto-hide form on successful prediction to focus on results
    const handleResult = (data, inputs) => {
        setResult(data);
        setCurrentInputs(inputs);
        if (window.innerWidth < 1024) {
            setIsFormVisible(false); // Auto-hide on mobile/tablet
        }
    };

    // Theme Toggle Logic
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const getTitle = () => {
        switch (activeTab) {
            case 'predict': return 'Churn Analysis Console';
            case 'analytics': return 'Analytics Dashboard';
            case 'batch': return 'Batch Prediction';
            case 'history': return 'History';
            default: return 'Dashboard';
        }
    };

    // View Switcher Component
    const renderContent = () => {
        if (activeTab === 'analytics') return <AnalyticsDashboard />;
        if (activeTab === 'batch') return <BatchPrediction />;
        if (activeTab === 'history') return <History />;

        return (
            <div className="flex h-full overflow-hidden relative">

                {/* Left: Input Form (Collapsible) */}
                <div className={`transition-all duration-300 ease-in-out border-r border-[var(--border-color)] bg-[var(--bg-card)] flex flex-col
                ${isFormVisible ? 'w-96 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'}
            `}>
                    <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
                        <h3 className="font-bold text-[var(--text-primary)]">Parameters</h3>
                        <button onClick={() => setIsFormVisible(false)} className="p-1 hover:bg-[var(--bg-secondary)] rounded text-[var(--text-secondary)]">
                            <ChevronLeft size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <PredictionForm onResult={handleResult} />
                    </div>
                </div>

                {/* Right: Results Area */}
                <div className="flex-1 flex flex-col h-full overflow-hidden relative">

                    {/* Toggle Button (Visible when form is hidden) */}
                    {!isFormVisible && (
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="absolute top-4 left-4 z-10 bg-[var(--accent-color)] text-white p-2 rounded-full shadow-lg hover:bg-opacity-90 transition-transform hover:scale-105"
                            title="Show Form"
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}

                    <div className="flex-1 overflow-y-auto p-8">
                        {result ? (
                            <div className="animate-fade-in-up space-y-8 max-w-7xl mx-auto">
                                {/* Header for Results */}
                                <div className="flex justify-between items-end border-b border-[var(--border-color)] pb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Prediction Analysis</h2>
                                        <p className="text-[var(--text-secondary)]">Customer Risk Profile generated successfully.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsFormVisible(!isFormVisible)} className="flex items-center gap-2 text-sm text-[var(--accent-color)] hover:underline">
                                            {isFormVisible ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                            {isFormVisible ? 'Focus View' : 'Show Parameters'}
                                        </button>
                                    </div>
                                </div>

                                <PredictionResults data={result} />
                                <ExplainabilitySection inputs={currentInputs} result={result} />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                <div className="w-32 h-32 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-6">
                                    <img src="https://illustrations.popsy.co/amber/surr-searching.svg" alt="Waiting" className="opacity-80 h-24" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Ready to Analyze</h3>
                                <p className="text-[var(--text-secondary)] max-w-sm">
                                    Configure the customer parameters on the left and click "Calculate Risk".
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`flex min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 overflow-hidden`}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 shrink-0 border-b border-[var(--border-color)] flex items-center justify-between px-8 bg-[var(--bg-card)] z-20">
                    <h2 className="text-lg font-semibold text-[var(--text-primary)] capitalize">
                        {getTitle()}
                    </h2>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] transition-colors"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </header>

                <div className="flex-1 overflow-hidden">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
