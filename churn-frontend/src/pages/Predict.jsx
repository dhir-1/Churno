import { useState } from "react";
import { useForm } from "react-hook-form";
import { predict } from "../api";
import { Link } from "react-router-dom";

const defaultValues = {
  customerID: "", gender: "", SeniorCitizen: "", Partner: "", Dependents: "",
  PhoneService: "", MultipleLines: "", InternetService: "", OnlineSecurity: "",
  OnlineBackup: "", DeviceProtection: "", TechSupport: "", StreamingTV: "",
  StreamingMovies: "", Contract: "", PaperlessBilling: "", PaymentMethod: "",
  tenure: "", MonthlyCharges: "", TotalCharges: "",
};

export default function Predict() {
  const { register, handleSubmit, reset } = useForm({ defaultValues });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await predict(data);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-12">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-lg font-bold transition-all duration-200">
            ← Back to Home
          </Link>
        </div>

        <div className="text-center space-y-8">
          <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
            Churn Predictor
          </h1>
          <p className="text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            Fill customer details below to get instant churn probability
          </p>
        </div>

        {/* Form + Result - Split layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* FORM */}
          <div className="space-y-12 bg-slate-800/50 backdrop-blur-xl p-12 rounded-3xl border border-slate-700/50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              
              {/* Customer Info */}
              <div className="space-y-8 p-8 bg-slate-700/30 rounded-2xl">
                <h3 className="text-3xl font-black text-cyan-400">👤 Customer Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-slate-300">Customer ID</label>
                    <input {...register("customerID")} className="w-full p-5 text-xl bg-slate-700 border-2 border-slate-600 rounded-2xl focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/30 transition-all duration-200 text-white placeholder-slate-500" placeholder="Enter ID" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-slate-300">Gender</label>
                    <select {...register("gender")} className="w-full p-5 text-xl bg-slate-700 border-2 border-slate-600 rounded-2xl focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/30 text-white">
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-slate-300">Senior Citizen</label>
                    <select {...register("SeniorCitizen")} className="w-full p-5 text-xl bg-slate-700 border-2 border-slate-600 rounded-2xl focus:border-cyan-400 text-white">
                      <option value="">Select</option>
                      <option>0</option>
                      <option>1</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-slate-300">Partner</label>
                    <select {...register("Partner")} className="w-full p-5 text-xl bg-slate-700 border-2 border-slate-600 rounded-2xl focus:border-cyan-400 text-white">
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-slate-300">Dependents</label>
                    <select {...register("Dependents")} className="w-full p-5 text-xl bg-slate-700 border-2 border-slate-600 rounded-2xl focus:border-cyan-400 text-white">
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-slate-300">Tenure (months)</label>
                    <input type="number" {...register("tenure", { valueAsNumber: true })} className="w-full p-5 text-xl bg-slate-700 border-2 border-slate-600 rounded-2xl focus:border-cyan-400 text-white" />
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-8 p-8 bg-slate-700/30 rounded-2xl">
                <h3 className="text-3xl font-black text-emerald-400">📱 Services</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    ["PhoneService", "Phone Service", ["Yes", "No"]],
                    ["MultipleLines", "Multiple Lines", ["Yes", "No"]],
                    ["InternetService", "Internet", ["DSL", "Fiber optic", "No"]],
                    ["OnlineSecurity", "Online Security", ["Yes", "No"]],
                    ["OnlineBackup", "Online Backup", ["Yes", "No"]],
                    ["DeviceProtection", "Device Protection", ["Yes", "No"]],
                    ["TechSupport", "Tech Support", ["Yes", "No"]],
                    ["StreamingTV", "Streaming TV", ["Yes", "No"]],
                    ["StreamingMovies", "Streaming Movies", ["Yes", "No"]],
                  ].map(([name, label, options]) => (
                    <div key={name} className="space-y-3">
                      <label className="block text-lg font-bold text-slate-300">{label}</label>
                      <select {...register(name)} className="w-full p-5 text-xl bg-slate-700 border-2 border-slate-600 rounded-2xl focus:border-emerald-400 text-white">
                        <option value="">Select</option>
                        {options.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account */}
              <div className="space-y-8 p-8 bg-slate-700/30 rounded-2xl">
                <h3 className="text-3xl font-black text-purple-400">📋 Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-slate-300">Contract</label>
                    <select {...register("Contract")} className="w-full p-5 text-xl bg-slate-700 border-2 border-slate-600 rounded-2xl focus:border-purple-400 text-white">
                      <option value="">Select</option>
                      <option>Month-to-month</option>
                      <option>One year</option>
                      <option>Two year</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-slate-300">Paperless Billing</label>
                    <select {...register("PaperlessBilling")} className="w-full p-5 text-xl bg-slate-700 border-2 border-slate-600 rounded-2xl focus:border-purple-400 text-white">
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-slate-300">Payment Method</label>
                    <select {...register("PaymentMethod")} className="w-full p-5 text-xl bg-slate-700 border-2 border-slate-600 rounded-2xl focus:border-purple-400 text-white">
                      <option value="">Select</option>
                      <option>Electronic check</option>
                      <option>Mailed check</option>
                      <option>Bank transfer (automatic)</option>
                      <option>Credit card (automatic)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Charges */}
              <div className="space-y-8 p-8 bg-slate-700/30 rounded-2xl">
                <h3 className="text-3xl font-black text-orange-400">💰 Charges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-slate-300">Monthly Charges ($)</label>
                    <input type="number" step="0.01" {...register("MonthlyCharges", { valueAsNumber: true })} className="w-full p-5 text-xl bg-slate-700 border-2 border-slate-600 rounded-2xl focus:border-orange-400 text-white" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-slate-300">Total Charges ($)</label>
                    <input type="text" {...register("TotalCharges")} className="w-full p-5 text-xl bg-slate-700 border-2 border-slate-600 rounded-2xl focus:border-orange-400 text-white" placeholder="e.g. 2730.00" />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-black text-xl py-8 px-12 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-200"
                >
                  {loading ? "🔄 Predicting..." : "🚀 PREDICT CHURN"}
                </button>
                <button
                  type="button"
                  onClick={() => reset()}
                  className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-black text-xl py-8 px-12 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-200"
                >
                  🔄 RESET
                </button>
              </div>
            </form>
          </div>

          {/* RESULT */}
          <div>
            {result && (
              <div className="sticky top-12 p-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border-4 border-cyan-500/30 shadow-2xl backdrop-blur-xl">
                <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  📊
                </h2>
                
                {/* Risk */}
                <div className={`p-12 rounded-3xl mb-12 text-center shadow-2xl transform transition-all duration-500 ${
                  result.risk === "High" 
                    ? "bg-gradient-to-r from-red-600 to-red-800 border-4 border-red-500/50 hover:scale-105" 
                    : "bg-gradient-to-r from-emerald-600 to-emerald-800 border-4 border-emerald-500/50 hover:scale-105"
                }`}>
                  <div className="text-7xl mb-6">
                    {result.risk === "High" ? "⚠️" : "✅"}
                  </div>
                  <p className="text-2xl opacity-90 mb-4">Churn Risk</p>
                  <p className="text-6xl font-black tracking-wider">{result.risk}</p>
                </div>

                {/* Probability */}
                <div className="p-12 bg-gradient-to-r from-blue-700 to-purple-800 rounded-3xl shadow-2xl border-4 border-blue-500/50 mb-12">
                  <p className="text-2xl opacity-90 mb-8 text-center">Churn Probability</p>
                  <div className="text-center">
                    <div className="text-8xl font-black mb-6">{((result.probability || 0) * 100).toFixed(1)}%</div>
                    <div className="inline-block bg-white/20 px-12 py-6 rounded-3xl text-3xl font-black text-white">
                      {result.prediction}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-8 bg-slate-700/50 rounded-2xl border-2 border-slate-600/50">
                  <h4 className="text-2xl font-bold mb-6 text-cyan-400">Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xl">
                    <div><span className="font-bold text-slate-400">Threshold:</span> {result.threshold}</div>
                    <div><span className="font-bold text-slate-400">Customer:</span> {result.customerID}</div>
                    <div className="md:col-span-2"><span className="font-bold text-slate-400">Prediction:</span> {result.prediction}</div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="p-12 bg-red-900/50 border-4 border-red-600/50 rounded-3xl">
                <div className="text-center">
                  <div className="text-6xl mb-6">⚠️</div>
                  <h3 className="text-3xl font-black mb-4 text-red-300">Error</h3>
                  <p className="text-xl text-red-200">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
