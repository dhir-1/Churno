import { useState } from 'react';
import axios from 'axios';
import { LayoutGrid, User, CreditCard, Activity, Cpu } from 'lucide-react';

const INITAL_STATE = {
    customerID: "USER_001",
    gender: "Male",
    SeniorCitizen: 0,
    Partner: "No",
    Dependents: "No",
    tenure: 12,
    PhoneService: "Yes",
    MultipleLines: "No",
    InternetService: "DSL",
    OnlineSecurity: "No",
    OnlineBackup: "No",
    DeviceProtection: "No",
    TechSupport: "No",
    StreamingTV: "No",
    StreamingMovies: "No",
    Contract: "Month-to-month",
    PaperlessBilling: "Yes",
    PaymentMethod: "Electronic check",
    MonthlyCharges: 29.85,
    TotalCharges: 29.85
};

export default function PredictionForm({ onResult }) {
    const [formData, setFormData] = useState(INITAL_STATE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let parsedValue = value;

        if (name === 'tenure' || name === 'SeniorCitizen') {
            parsedValue = value === "" ? 0 : parseInt(value);
        } else if (name === 'MonthlyCharges' || name === 'TotalCharges') {
            parsedValue = value === "" ? 0.0 : parseFloat(value);
        }

        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const randomID = `CSR-${Math.floor(1000 + Math.random() * 9000)}`;
            const payload = { ...formData, customerID: randomID };
            const response = await axios.post('http://127.0.0.1:8000/predict', payload);
            onResult(response.data, payload);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to connect to backend.");
        } finally {
            setLoading(false);
        }
    };

    const labelStyle = "block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3 ml-1";
    const sectionHeaderStyle = "text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 mb-6 pb-2 border-b border-[var(--border-color)]";

    // Custom Toggle Button Component
    const ToggleGroup = ({ label, name, options, value, onChange }) => (
        <div className="mb-4">
            <label className={labelStyle}>{label}</label>
            <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg">
                {options.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onChange(name, opt)}
                        className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${value === opt
                            ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col p-6 lg:p-8 space-y-8 animate-fade-in overflow-y-auto">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Parameters</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Configure customer metrics</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2">{error}</div>}

            <form onSubmit={handleSubmit} className="flex-1 space-y-8 pb-4">

                {/* Group 1: Profile */}
                <div>
                    <h3 className={sectionHeaderStyle}>
                        <User size={16} className="text-blue-500" /> User Profile
                    </h3>
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <ToggleGroup
                                label="Gender"
                                name="gender"
                                options={['Male', 'Female']}
                                value={formData.gender}
                                onChange={handleSelectChange} // Corrected
                            />
                            <ToggleGroup
                                label="Senior Citizen"
                                name="SeniorCitizen"
                                options={[0, 1]}
                                value={formData.SeniorCitizen}
                                onChange={handleSelectChange}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <ToggleGroup
                                label="Partner"
                                name="Partner"
                                options={['No', 'Yes']}
                                value={formData.Partner}
                                onChange={handleSelectChange}
                            />
                            <ToggleGroup
                                label="Dependents"
                                name="Dependents"
                                options={['No', 'Yes']}
                                value={formData.Dependents}
                                onChange={handleSelectChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Group 2: Services */}
                <div>
                    <h3 className={sectionHeaderStyle}>
                        <Activity size={16} className="text-purple-500" /> Services & Security
                    </h3>
                    <div className="space-y-6">
                        <ToggleGroup
                            label="Internet Service"
                            name="InternetService"
                            options={['No', 'DSL', 'Fiber optic']}
                            value={formData.InternetService}
                            onChange={handleSelectChange}
                        />

                        {/* Custom Toggles Grid */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            {['PhoneService', 'MultipleLines', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies'].map((field) => (
                                <div key={field} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                                        {field.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => handleSelectChange(field, formData[field] === 'Yes' ? 'No' : 'Yes')}
                                        className={`relative w-11 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${formData[field] === 'Yes' ? 'bg-[var(--accent-color)]' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    >
                                        <div
                                            className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${formData[field] === 'Yes' ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Group 3: Financials */}
                <div>
                    <h3 className={sectionHeaderStyle}>
                        <CreditCard size={16} className="text-green-500" /> Billing & Contract
                    </h3>
                    <div className="space-y-8">
                        <ToggleGroup
                            label="Contract Type"
                            name="Contract"
                            options={['Month-to-month', 'One year', 'Two year']}
                            value={formData.Contract}
                            onChange={handleSelectChange}
                        />

                        {/* Interactive Sliders */}
                        <div className="space-y-6">
                            {/* Tenure Slider */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <label className={labelStyle}>Tenure Duration</label>
                                    <span className="text-lg font-bold text-[var(--accent-color)] tabular-nums">
                                        {formData.tenure} <span className="text-xs font-normal text-[var(--text-secondary)]">Months</span>
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    name="tenure"
                                    min="0"
                                    max="72"
                                    value={formData.tenure}
                                    onChange={handleChange}
                                    className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)] hover:accent-[var(--accent-hover)] transition-all"
                                />
                                <div className="flex justify-between text-[10px] text-[var(--text-secondary)] px-1">
                                    <span>New (0)</span>
                                    <span>Loyal (72)</span>
                                </div>
                            </div>

                            {/* Monthly Charges Slider */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <label className={labelStyle}>Monthly Charges</label>
                                    <span className="text-lg font-bold text-[var(--accent-color)] tabular-nums">
                                        ${formData.MonthlyCharges}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    name="MonthlyCharges"
                                    min="18"
                                    max="120"
                                    step="0.5"
                                    value={formData.MonthlyCharges}
                                    onChange={handleChange}
                                    className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)] hover:accent-[var(--accent-hover)] transition-all"
                                />
                                <div className="flex justify-between text-[10px] text-[var(--text-secondary)] px-1">
                                    <span>Basic ($18)</span>
                                    <span>Premium ($120)</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className={labelStyle}>Payment Method</label>
                            <select
                                name="PaymentMethod"
                                value={formData.PaymentMethod}
                                onChange={handleChange}
                                className="w-full p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent outline-none transition-all"
                            >
                                <option value="Electronic check">Electronic check</option>
                                <option value="Mailed check">Mailed check</option>
                                <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
                                <option value="Credit card (automatic)">Credit card (automatic)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-6 sticky bottom-0 bg-[var(--bg-card)]/80 backdrop-blur-md pb-4 border-t border-[var(--border-color)] -mx-6 px-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[var(--color-brand-600)] to-[var(--color-brand-500)] hover:from-[var(--color-brand-700)] hover:to-[var(--color-brand-600)] text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base tracking-wide"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <Cpu size={20} /> Analyze Risk Profile
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
