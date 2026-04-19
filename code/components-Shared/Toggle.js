// Oval-shaped, reusable Toggle switch component
// Props: checked (boolean), onChange (function), activeColor (string, default orange)
const Toggle = ({ checked, onChange, activeColor = "#ff5c00" }) => (
  <label className="relative inline-flex items-center cursor-pointer select-none">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
    />
    <div
      className="w-14 h-8 rounded-full transition-colors duration-200 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-orange-400 relative"
      style={{ backgroundColor: checked ? activeColor : undefined }}
    >
      <div
        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200"
        style={{ transform: checked ? "translateX(24px)" : "translateX(0)" }}
      />
    </div>
  </label>
);

export default Toggle;