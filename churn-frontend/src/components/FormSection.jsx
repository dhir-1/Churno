export default function FormSection({ title, children }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8 flex items-center gap-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function FormField({ label, type = "text", register, name, options = [], step }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      {type === "select" ? (
        <select
          {...register(name)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 bg-white/50 hover:border-gray-300 shadow-sm"
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : type === "number" ? (
        <input
          type="number"
          step={step || "1"}
          {...register(name, { valueAsNumber: true })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 bg-white/50 hover:border-gray-300 shadow-sm"
        />
      ) : (
        <input
          type={type}
          {...register(name)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 bg-white/50 hover:border-gray-300 shadow-sm"
        />
      )}
    </div>
  );
}
