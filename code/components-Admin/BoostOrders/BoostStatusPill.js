const STATUS_STYLES = {
  pending:    "bg-yellow-100 text-yellow-800",
  scheduled:  "bg-blue-100   text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  completed:  "bg-green-100  text-green-800",
  failed:     "bg-red-100    text-red-800",
  cancelled:  "bg-gray-100   text-gray-600",
};

const STATUS_LABELS = {
  pending:    "قيد الانتظار",
  scheduled:  "مجدول",
  processing: "جاري التنفيذ",
  completed:  "مكتمل",
  failed:     "فشل",
  cancelled:  "ملغي",
};

const TYPE_LABELS = {
  in_app:    "داخل التطبيق",
  push:      "إشعار",
  instagram: "إنستغرام",
  whatsapp:  "واتساب",
};

const METHOD_LABELS = {
  automatic:   "تلقائي",
  manual:      "يدوي",
  "semi-manual": "شبه يدوي",
};

const METHOD_STYLES = {
  automatic:   "bg-green-100  text-green-700",
  manual:      "bg-red-100    text-red-700",
  "semi-manual": "bg-yellow-100 text-yellow-700",
};

const SUBTYPE_LABELS = {
  story:        "ستوري",
  post:         "بوست",
  reel:         "ريل",
  urgent_push:  "إشعار عاجل",
};

export function BoostStatusPill({ value }) {
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[value] || "bg-gray-100 text-gray-600"}`}>
      {STATUS_LABELS[value] || value}
    </span>
  );
}

export function BoostTypePill({ value }) {
  return (
    <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
      {TYPE_LABELS[value] || value}
    </span>
  );
}

export function BoostMethodPill({ value }) {
  if (!value) return <span className="text-gray-300 text-xs">—</span>;
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${METHOD_STYLES[value] || "bg-gray-100 text-gray-600"}`}>
      {METHOD_LABELS[value] || value}
    </span>
  );
}

export function BoostSubTypePill({ value }) {
  if (!value) return <span className="text-gray-300 text-xs">—</span>;
  return (
    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium">
      {SUBTYPE_LABELS[value] || value}
    </span>
  );
}

export { STATUS_LABELS, TYPE_LABELS, METHOD_LABELS, SUBTYPE_LABELS };
