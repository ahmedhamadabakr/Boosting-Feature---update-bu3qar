import { useState } from "react";
import toast from "react-hot-toast";
import { fetcher } from "@/lib/fetch";

// ── config لكل action ─────────────────────────────────────────────────────────
const ACTION_CONFIG = {
  // Instagram
  prepare:     { label: "تجهيز المحتوى", style: "indigo",  confirm: false },
  publish:     { label: "نشر",           style: "green",   confirm: true  },
  attach_link: { label: "إرفاق رابط",    style: "blue",    confirm: false },
  // WhatsApp
  approve:     { label: "موافقة",        style: "teal",    confirm: true  },
  send:        { label: "إرسال",         style: "green",   confirm: true  },
  reschedule:  { label: "إعادة جدولة",   style: "yellow",  confirm: true  },
  // Push
  send_urgent: { label: "⚡ إرسال عاجل", style: "red",     confirm: true  },
};

const TYPE_ACTIONS = {
  instagram: ["prepare", "publish", "attach_link"],
  whatsapp:  ["approve", "send", "reschedule"],
  push:      ["send_urgent"],
  in_app:    [],
};

const STYLE_MAP = {
  indigo: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200",
  green:  "bg-green-50  text-green-700  hover:bg-green-100  border-green-200",
  blue:   "bg-blue-50   text-blue-700   hover:bg-blue-100   border-blue-200",
  teal:   "bg-teal-50   text-teal-700   hover:bg-teal-100   border-teal-200",
  yellow: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200",
  red:    "bg-red-50    text-red-700    hover:bg-red-100    border-red-200",
};

export default function BoostTypeActions({ item, onSuccess }) {
  const [loading, setLoading] = useState(null);

  const actions = TYPE_ACTIONS[item.boostType] ?? [];

  const isTerminal = ["completed", "cancelled"].includes(item.status);
  if (actions.length === 0 || isTerminal) return null;

  const handleAction = async (action) => {
    const cfg = ACTION_CONFIG[action];
    if (cfg.confirm && !window.confirm(`تأكيد: ${cfg.label}؟`)) return;

    setLoading(action);
    try {
      await fetcher(`/api/admin/boost-items/${item._id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: `${cfg.label} — يدوي` }),
      });
      toast.success(`${cfg.label}`);
      onSuccess?.();
    } catch (err) {
      toast.error(err?.message || "حدث خطأ");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-1 mt-1 pt-1 border-t border-dashed border-gray-200">
      {actions.map((action) => {
        const cfg = ACTION_CONFIG[action];
        const isLoading = loading === action;
        return (
          <button
            key={action}
            onClick={() => handleAction(action)}
            disabled={loading !== null}
            title={cfg.label}
            className={`
              text-xs px-2 py-1 rounded border font-medium transition
              ${STYLE_MAP[cfg.style]}
              ${loading !== null ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {isLoading ? "..." : cfg.label}
          </button>
        );
      })}
    </div>
  );
}
