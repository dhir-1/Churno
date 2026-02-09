import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Telco Churn Predictor
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Predict customer churn risk in seconds. Enter customer details and get instant predictions powered by machine learning.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📊 Analyze</h3>
            <p className="text-sm text-blue-700">Get churn probability based on customer behavior</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">📈 Track</h3>
            <p className="text-sm text-green-700">View prediction history and trends</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            to="/predict"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition text-center"
          >
            Start Prediction
          </Link>
          <Link
            to="/history"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition text-center"
          >
            View History
          </Link>
        </div>
      </div>
    </div>
  );
}
