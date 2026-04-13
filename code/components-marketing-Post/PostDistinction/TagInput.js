// Free-text label the user attaches to the boosted listing
const TagInput = ({ value, onChange, hasError }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200">
    <label className="block font-bold mb-2">
      وصف الإعلان <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="أدخل وصفاً مميزاً لإعلانك"
      className={`w-full p-3 border rounded-lg focus:outline-none focus:border-orange-500 transition-colors ${
        hasError ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    />
    {hasError && (
      <p className="text-red-500 text-sm mt-1">قم بإدخال وصف للإعلان</p>
    )}
  </div>
);

export default TagInput;
