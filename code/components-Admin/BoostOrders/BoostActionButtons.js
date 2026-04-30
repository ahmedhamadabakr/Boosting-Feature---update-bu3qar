import { useState } from "react";
import toast from "react-hot-toast";
import { fetcher } from "@/lib/fetch";
import { getAvailableActions } from "@/lib/boostTransitions";
import BoostTypeActions from "./BoostTypeActions";

const STYLE_MAP = {
  blue:   "bg-blue-50   text-blue-700   hover:bg-blue-100   border-blue-200",
  purple: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200",
  green:  "bg-green-50  text-green-700  hover:bg-green-100  border-green-200",
  red:    "bg-red-50    text-red-700    hover:bg-red-100    border-red-200",
  gray:   "bg-gray-50   text-gray-600   hover:bg-gray-100   border-gray-200",
};

export default function BoostActionButtons({ item, onSuccess, onViewDetails }) {
  const [loadingStatus, setLoadingStatus] = useState(null);

  const actions = getAvailableActions(item.status);

  const handleAction = async (nextStatus) => {
    if (nextStatus === "cancelled") {
      if (!window.confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) return;
    }
    setLoadingStatus(nextStatus);
    try {
      await fetcher(`/api/admin/boost-items/${item._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, reason: "تحديث يدوي من الأدمن" }),
      });
      toast.success(`تم التحديث`);
      onSuccess?.();
    } catch (err) {
      toast.error(err?.message || "حدث خطأ");
    } finally {
      setLoadingStatus(null);
    }
  };

  const isTerminal = actions.length === 0;

  return (
    <div className="space-y-1">
      {/* ── View details button ── */}
      <button
        onClick={() => onViewDetails?.(item)}
        className="text-xs px-2 py-1 rounded border bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200 font-medium transition w-full text-right"
      >
       التفاصيل
      </button>

      {/* ── Status transitions ── */}
      {!isTerminal && (
        <div className="flex flex-wrap gap-1">
          {actions.map(({ status, label, style }) => {
            const isLoading = loadingStatus === status;
            return (
              <button
                key={status}
                onClick={() => handleAction(status)}
                disabled={loadingStatus !== null}
                className={`
                  text-xs px-2 py-1 rounded border font-medium transition
                  ${STYLE_MAP[style]}
                  ${loadingStatus !== null ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {isLoading ? "..." : label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Type-specific actions ── */}
      <BoostTypeActions item={item} onSuccess={onSuccess} />
    </div>
  );
}
