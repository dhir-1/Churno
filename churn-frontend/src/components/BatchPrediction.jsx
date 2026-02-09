import { useState } from 'react';
import { uploadBatchPrediction } from '../api';
import { UploadCloud, CheckCircle, FileText, Download } from 'lucide-react';

export default function BatchPrediction() {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState(null);
    const [summary, setSummary] = useState(null);
    const [fullData, setFullData] = useState(null);
    const [error, setError] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragging(true);
        } else if (e.type === 'dragleave') {
            setDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (uploadedFile) => {
        if (uploadedFile.type !== 'text/csv' && !uploadedFile.name.endsWith('.csv')) {
            setError('Please upload a valid CSV file.');
            return;
        }
        setError(null);
        setFile(uploadedFile);
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const data = await uploadBatchPrediction(file);
            // setResults(data.results); // Old way
            setResults(data.preview_rows); // New way: Top 100 Priority
            setSummary({
                total: data.total_processed,
                highRisk: data.high_risk_count
            });
            setFullData(data.full_results);
        } catch (err) {
            setError(err.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = () => {
        if (!fullData) return;

        // Convert to CSV
        const headers = ["Customer ID", "Churn Probability", "Risk Level"];
        const csvContent = [
            headers.join(","),
            ...fullData.map(row => `${row.customerID},${row.churn_probability},${row.risk}`)
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "churn_predictions_full.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 h-full flex flex-col">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Batch Prediction</h2>

            {!results ? (
                <div className="flex-1 flex flex-col justify-center items-center">
                    <div
                        className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
                        ${dragging ? 'border-[var(--accent-color)] bg-[var(--accent-bg)]/10' : 'border-[var(--border-color)] hover:border-[var(--accent-color)]'}
                        `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-upload').click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--text-secondary)]">
                            {file ? <FileText size={32} className="text-[var(--accent-color)]" /> : <UploadCloud size={32} />}
                        </div>

                        {file ? (
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{file.name}</h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                                    disabled={uploading}
                                    className="mt-6 px-6 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 font-medium transition-all"
                                >
                                    {uploading ? 'Processing...' : 'Run Analysis'}
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--text-primary)]">Upload Customer CSV</h3>
                                <p className="text-[var(--text-secondary)] mt-2">Drag and drop or click to browse</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-4 opacity-70">Supports .csv files only</p>
                            </div>
                        )}
                    </div>
                    {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
                </div>
            ) : (
                <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-sm">
                    {/* Summary Stats Header */}
                    <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[var(--text-secondary)]">Total Processed</p>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{summary.total.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                                <UploadCloud size={24} className="rotate-180" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[var(--text-secondary)]">High Risk Customers</p>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">
                                    {summary.highRisk.toLocaleString()}
                                    <span className="text-sm font-normal text-[var(--text-secondary)] ml-2">
                                        ({(summary.highRisk / summary.total * 100).toFixed(1)}%)
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                <Download size={18} />
                                Download Full Report
                            </button>
                        </div>
                    </div>

                    <div className="px-6 py-3 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-card)]">
                        <h3 className="text-sm font-bold text-[var(--accent-color)] uppercase tracking-wider">
                            Priority Attention (Top 100 High Risk)
                        </h3>
                        <button
                            onClick={() => { setResults(null); setFile(null); }}
                            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                            Upload New Batch
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[var(--bg-secondary)] sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-[var(--text-secondary)] border-b border-[var(--border-color)]">Customer ID</th>
                                    <th className="p-4 text-sm font-semibold text-[var(--text-secondary)] border-b border-[var(--border-color)]">Churn Probability</th>
                                    <th className="p-4 text-sm font-semibold text-[var(--text-secondary)] border-b border-[var(--border-color)]">Risk Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((row, idx) => (
                                    <tr key={idx} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/50">
                                        <td className="p-4 text-sm text-[var(--text-primary)] font-medium">{row.customerID}</td>
                                        <td className="p-4 text-sm text-[var(--text-primary)]">{(row.churn_probability * 100).toFixed(2)}%</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                ${row.risk === 'HIGH' ? 'bg-red-100 text-red-700' :
                                                    row.risk === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {row.risk}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
