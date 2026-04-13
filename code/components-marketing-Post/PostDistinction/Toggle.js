const Toggle = ({ on }) => (
  <div
    className={`w-14 h-8 rounded-full relative p-1 transition-colors pointer-events-none ${
      on ? "bg-orange-500" : "bg-gray-300"
    }`}
  >
    <div
      className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
        on ? "translate-x-[-18px]" : "translate-x-0"
      }`}
    />
  </div>
);

export default Toggle;