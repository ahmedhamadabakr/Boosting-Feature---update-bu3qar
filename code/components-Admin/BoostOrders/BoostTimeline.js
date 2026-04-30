import { dateFormat } from "@/utils/dateFormat";

const ACTION_META = {
  // insert
  assigned_to_queue:              { label: "دخل الـ Queue",         color: "bg-blue-100   text-blue-700"   },
  rescheduled:                    { label: "أُعيد الجدولة",         color: "bg-indigo-100 text-indigo-700" },
  returned_to_queue_after_failure:{ label: "رجع للـ Queue بعد فشل", color: "bg-orange-100 text-orange-700" },
  // status changes
  status_changed_to_pending:      { label: "قيد الانتظار",          color: "bg-yellow-100 text-yellow-700" },
  status_changed_to_scheduled:    { label: "تم الجدولة",            color: "bg-blue-100   text-blue-700"   },
  status_changed_to_processing:   { label: "بدأ التنفيذ",           color: "bg-purple-100 text-purple-700" },
  status_changed_to_completed:    { label: "اكتمل",                 color: "bg-green-100  text-green-700"  },
  status_changed_to_failed:       { label: "فشل",                   color: "bg-red-100    text-red-700"    },
  status_changed_to_cancelled:    { label: "ملغي",                  color: "bg-gray-100   text-gray-600"   },
};

function getActionMeta(action) {
  return ACTION_META[action] ?? { label: action, icon: "📌", color: "bg-gray-100 text-gray-600" };
}

export default function BoostTimeline({ logs }) {
  if (!logs || logs.length === 0) {
    return <p className="text-xs text-gray-400 py-2">لا توجد سجلات بعد</p>;
  }

  // ترتيب من الأقدم للأحدث
  const sorted = [...logs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="relative" dir="rtl">
      {/* vertical line */}
      <div className="absolute right-3 top-0 bottom-0 w-px bg-gray-200" />

      <div className="space-y-3 pr-8">
        {sorted.map((log, i) => {
          const { label, icon, color } = getActionMeta(log.action);
          return (
            <div key={i} className="relative flex items-start gap-3">
        

              <div className={`flex-1 rounded-lg px-3 py-2 text-xs ${color}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{label}</span>
                  <span className="opacity-60 whitespace-nowrap">
                    {log.createdAt ? dateFormat(log.createdAt) : "—"}
                  </span>
                </div>
                {log.reason && (
                  <p className="mt-0.5 opacity-75">{log.reason}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
