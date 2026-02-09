export default function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${color} text-white`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
        </div>
    );
}
