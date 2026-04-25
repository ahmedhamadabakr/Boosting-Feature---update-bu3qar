const FieldInput = ({
  label,
  value,
  onChange,
  type = "text",
  unit,
  focusColor = "#ff5c00",
  inputClassName = "",
}) => (
  <div>
    {label && (
      <label className="block text-xs font-bold text-neutral-500 mb-2">{label}</label>
    )}
    <div
      className="flex items-center border-b border-neutral-300"
      style={{ "--focus-color": focusColor }}
      onFocus={(e) => (e.currentTarget.style.borderColor = focusColor)}
      onBlur={(e)  => (e.currentTarget.style.borderColor = "")}
    >
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full py-2 bg-transparent border-0 focus:ring-0 focus:outline-none ${inputClassName}`}
        min={1}
      />
      {unit && <span className="text-neutral-400 text-sm whitespace-nowrap pr-1">{unit}</span>}
    </div>
  </div>
);

export default FieldInput;
