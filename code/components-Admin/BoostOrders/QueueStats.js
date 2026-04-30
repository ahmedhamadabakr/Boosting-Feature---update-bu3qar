export default function QueueStats({ stats }) {
  if (!stats) return null;

  const { totalSlots, fullSlots, availableSlots, totalBooked, totalCapacity, utilizationRate } = stats;

  const utilColor =
    utilizationRate >= 90 ? "text-red-600" :
    utilizationRate >= 60 ? "text-yellow-600" :
    "text-green-600";

  const cards = [
    { label: "إجمالي الـ Slots",  value: totalSlots,     color: "bg-blue-50   border-blue-100"   },
    { label: "Slots متاحة",       value: availableSlots, color: "bg-green-50  border-green-100"  },
    { label: "Slots ممتلئة",      value: fullSlots,      color: "bg-red-50    border-red-100"    },
    { label: "إجمالي المحجوز",    value: `${totalBooked}/${totalCapacity}`, color: "bg-orange-50 border-orange-100" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3" dir="rtl">
      {cards.map((c) => (
        <div key={c.label} className={`border rounded-xl p-3 ${c.color}`}>
          <div className="flex items-center gap-2 mb-1">
          
            <span className="text-xs text-gray-500">{c.label}</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{c.value}</p>
        </div>
      ))}

      {/* Utilization bar */}
      <div className="col-span-2 md:col-span-4 bg-white border border-gray-100 rounded-xl p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">نسبة الاستخدام</span>
          <span className={`text-sm font-bold ${utilColor}`}>{utilizationRate}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              utilizationRate >= 90 ? "bg-red-500" :
              utilizationRate >= 60 ? "bg-yellow-400" :
              "bg-green-400"
            }`}
            style={{ width: `${Math.min(utilizationRate, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
