// ─── State Machine ────────────────────────────────────────────────────────────
// هذا الملف مشترك بين الـ API والـ Frontend
// لا تعدّل الـ transitions إلا بعد مراجعة كاملة

export const ALLOWED_TRANSITIONS = {
  pending:    ["scheduled", "processing", "cancelled"],
  scheduled:  ["processing", "cancelled"],
  processing: ["completed", "failed"],
  failed:     ["processing"],
  completed:  [],   
  cancelled:  [],   
};

/**
 * يرجع true لو الـ transition مسموح
 */
export function isTransitionAllowed(currentStatus, nextStatus) {
  return (ALLOWED_TRANSITIONS[currentStatus] ?? []).includes(nextStatus);
}

/**
 * يرجع الـ actions المتاحة لحالة معينة كـ array من { label, status, style }
 */
export function getAvailableActions(currentStatus) {
  const transitions = ALLOWED_TRANSITIONS[currentStatus] ?? [];

  const META = {
    scheduled:  { label: "جدولة",        style: "blue"   },
    processing: { label: "بدء التنفيذ",  style: "purple" },
    completed:  { label: "اكتمل",        style: "green"  },
    failed:     { label: "فشل",          style: "red"    },
    cancelled:  { label: "إلغاء",        style: "gray"   },
  };

  return transitions.map((s) => ({ status: s, ...META[s] }));
}
