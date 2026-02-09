import { useState, useEffect } from "react";
import { getHistory } from "../api";
import { Link } from "react-router-dom";
import { Trash2, AlertCircle } from "lucide-react";
import axios from "axios";

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setPredictions(data || []);
    } catch (err) {
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to delete all prediction history?")) return;
    try {
      await axios.delete("http://127.0.0.1:8000/predictions");
      setPredictions([]);
    } catch (err) {
      alert("Failed to clear history");
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[var(--bg-primary)] p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Prediction History</h1>
            <p className="text-[var(--text-secondary)]">Archive of all past analysis</p>
          </div>
          {predictions.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-red-200"
            >
              <Trash2 size={18} /> Clear History
            </button>
          )}
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {!loading && predictions.length === 0 && (
          <div className="bg-[var(--bg-card)] p-12 rounded-2xl text-center border border-[var(--border-color)]">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity size={32} className="text-gray-400" />
            </div>
            <p className="text-[var(--text-secondary)] mb-4 text-lg">No predictions recorded yet</p>
            <p className="text-sm text-gray-500">
              Go to <span className="font-semibold text-[var(--accent-color)]">Predict</span> tab to start analysis.
            </p>
          </div>
        )}

        {predictions.length > 0 && (
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Customer ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Probability</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {predictions.map((pred, idx) => (
                    <tr key={idx} className="hover:bg-[var(--bg-secondary)] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{pred.customer_id || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-mono">
                        {((pred.probability || 0) * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${pred.risk === "High" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                            pred.risk === "Medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pred.risk === "High" ? "bg-red-600" :
                              pred.risk === "Medium" ? "bg-yellow-600" : "bg-green-600"
                            }`}></span>
                          {pred.risk || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                        {new Date(pred.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper icon since I removed the import in the block above for Activity
import { Activity } from "lucide-react";
