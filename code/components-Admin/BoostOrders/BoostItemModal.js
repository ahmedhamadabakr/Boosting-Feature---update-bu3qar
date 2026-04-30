import { BoostStatusPill, BoostTypePill } from "./BoostStatusPill";

export default function BoostItemModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">تفاصيل الطلب</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-sm">
          <Row label="رقم الطلب"  value={item.orderId} />
          <Row label="المعلن"     value={item.advertiser?.username || "—"} />
          <Row label="الإعلان"    value={item.listing?.title || "—"} />
          <Row label="كود الإعلان" value={item.listing?.code ? `#${item.listing.code}` : "—"} />
          <Row
            label="نوع البوست"
            value={<BoostTypePill value={item.boostType} />}
          />
          <Row
            label="الحالة"
            value={<BoostStatusPill value={item.status} />}
          />
          {item.isUrgent && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700 text-xs font-semibold">
               طلب عاجل
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 rounded-xl transition"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
