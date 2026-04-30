const CARDS = [
  { key: "totalToday",    label: "اليوم",          color: "bg-blue-50   border-blue-100   text-blue-700"   },
  { key: "pending",       label: "قيد الانتظار",   color: "bg-yellow-50 border-yellow-100 text-yellow-700" },
  { key: "scheduled",     label: "مجدول",          color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
  { key: "processing",    label: "جاري التنفيذ",   color: "bg-purple-50 border-purple-100 text-purple-700" },
  { key: "completed",     label: "مكتمل",          color: "bg-green-50  border-green-100  text-green-700"  },
  { key: "failed",        label: "فشل / ملغي",     color: "bg-red-50 border-red-100 text-red-700" },
  { key: "urgentPending", label: "عاجل ينتظر",     color: "bg-orange-50 border-orange-200 text-orange-700" },
];

export default function BoostSummaryCards({ stats, loading, onCardClick, activeFilter }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3" dir="rtl">
      {CARDS.map(({ key, label, icon, color }) => {
        const isActive = activeFilter === key;
        return (
          <button
            key={key}
            onClick={() => onCardClick?.(key)}
            className={`
              border rounded-xl p-3 text-right transition
              ${color}
              ${isActive ? "ring-2 ring-orange-400 shadow-md" : "hover:shadow-sm"}
              ${loading ? "opacity-60 cursor-default" : "cursor-pointer"}
            `}
          >
          
            <div className="text-2xl font-bold">
              {loading ? "—" : (stats?.[key] ?? 0)}
            </div>
            <div className="text-xs mt-0.5 opacity-80">{label}</div>
          </button>
        );
      })}
    </div>
  );
}
