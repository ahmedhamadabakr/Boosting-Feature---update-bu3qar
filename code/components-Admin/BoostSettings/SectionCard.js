const SectionCard = ({ children, accent = false, className = "" }) => (
  <div
    className={`bg-white p-6 md:p-8 ${accent ? "border-r-4 border-[#ff5c00]" : ""} ${className}`}
  >
    {children}
  </div>
);

export default SectionCard;
