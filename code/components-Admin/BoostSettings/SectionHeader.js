import Toggle from "../../Shared/Toggle";

// Top row of every settings section: icon (optional), title, description, toggle
const SectionHeader = ({
  icon,
  title,
  description,
  enabled,
  onToggle,
  activeColor = "#ff5c00",
}) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
    <div className="flex items-start gap-4">
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-neutral-100">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-lg md:text-xl font-bold mb-1">{title}</h3>
        <p className="text-neutral-500 text-sm">{description}</p>
      </div>
    </div>
    <Toggle checked={enabled} onChange={onToggle} activeColor={activeColor} />
  </div>
);

export default SectionHeader;
