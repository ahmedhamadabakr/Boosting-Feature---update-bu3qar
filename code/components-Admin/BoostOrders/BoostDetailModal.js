import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { fetcher } from "@/lib/fetch";
import {
  BoostStatusPill,
  BoostTypePill,
  BoostMethodPill,
  BoostSubTypePill,
} from "./BoostStatusPill";
import BoostTimeline from "./BoostTimeline";
import BoostTypeActions from "./BoostTypeActions";
import { dateFormat } from "@/utils/dateFormat";

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-2 text-sm">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className="font-medium text-gray-800 text-right">
        {value ?? "—"}
      </span>
    </div>
  );
}

// ── Add Note form ─────────────────────────────────────────────────────────────
function AddNoteForm({ itemId, onAdded }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await fetcher(`/api/admin/boost-items/${itemId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_note",
          note: text.trim(),
        }),
      });
      toast.success("تمت إضافة الملاحظة");
      setText("");
      onAdded?.();
    } catch (err) {
      toast.error(err?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="أضف ملاحظة داخلية..."
        className="flex-1 border border-gray-200 rounded-lg text-xs py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-orange-300"
      />
      <button
        onClick={submit}
        disabled={loading || !text.trim()}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-xs px-3 py-1.5 rounded-lg transition"
      >
        {loading ? "..." : "إضافة"}
      </button>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function BoostDetailModal({
  item,
  onClose,
  onStatusChange,
}) {
  const [activeTab, setActiveTab] = useState("info");

  if (!item) return null;

  const listing = item.listing ?? {};
  const advertiser = item.advertiser ?? {};
  const image =
    listing.images?.[0]?.url ?? listing.images?.[0] ?? null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 my-auto"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800 text-base">
              تفاصيل الطلب
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {item.orderId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* ── Listing image ── */}
        {image && (
          <div className="relative w-full h-36">
            <Image
              src={image}
              alt={listing.title || "image"}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex border-b border-gray-100 px-5">
          {[
            { id: "info", label: "المعلومات" },
            { id: "timeline", label: "السجل" },
            {
              id: "notes",
              label: `الملاحظات ${
                item.notes?.length ? `(${item.notes.length})` : ""
              }`,
            },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px transition ${
                activeTab === t.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="px-5 py-4 max-h-[55vh] overflow-y-auto">
          {/* ── TAB: INFO ── */}
          {activeTab === "info" && (
            <>
              <Section title="معلومات الإعلان">
                <Row label="العنوان" value={listing.title} />
                <Row
                  label="الكود"
                  value={listing.code ? `#${listing.code}` : null}
                />
                <Row label="المنطقة" value={listing.region} />
                <Row
                  label="السعر"
                  value={
                    listing.price ? `${listing.price} د.ك` : null
                  }
                />
              </Section>

              <Section title="معلومات المعلن">
                <Row label="الاسم" value={advertiser.username} />
                <Row label="الهاتف" value={advertiser.phone} />
              </Section>

              <Section title="معلومات البوست">
                <Row
                  label="نوع البوست"
                  value={<BoostTypePill value={item.boostType} />}
                />
                <Row
                  label="الفئة"
                  value={<BoostSubTypePill value={item.subType} />}
                />
                <Row
                  label="الطريقة"
                  value={
                    <BoostMethodPill
                      value={item.processingMethod}
                    />
                  }
                />
                <Row
                  label="الحالة"
                  value={<BoostStatusPill value={item.status} />}
                />
                <Row
                  label="السعر"
                  value={item.price ? `${item.price} د.ك` : null}
                />

                {item.isUrgent && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 text-red-700 text-xs font-bold">
                    ⚡ طلب عاجل
                  </div>
                )}
              </Section>

              <Section title="التواريخ">
                <Row
                  label="تاريخ الشراء"
                  value={
                    item.purchaseDate
                      ? dateFormat(item.purchaseDate)
                      : null
                  }
                />
                <Row
                  label="موعد التنفيذ"
                  value={item.scheduledAt ?? null}
                />
                <Row
                  label="تاريخ البداية"
                  value={
                    item.startDate
                      ? dateFormat(item.startDate)
                      : null
                  }
                />
                <Row
                  label="تاريخ النهاية"
                  value={
                    item.endDate
                      ? dateFormat(item.endDate)
                      : null
                  }
                />
              </Section>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">
                  إجراءات خاصة بالنوع
                </p>
                <BoostTypeActions
                  item={item}
                  onSuccess={onStatusChange}
                />
              </div>
            </>
          )}

          {/* ── TAB: TIMELINE ── */}
          {activeTab === "timeline" && (
            <BoostTimeline logs={item.logs ?? []} />
          )}

          {/* ── TAB: NOTES ── */}
          {activeTab === "notes" && (
            <div>
              {item.notes?.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {[...item.notes].reverse().map((n) => (
                    <div
                      key={n._id || n.createdAt}
                      className="bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2"
                    >
                      <p className="text-sm text-gray-800">
                        {n.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {n.createdAt
                          ? dateFormat(n.createdAt)
                          : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-4 text-center">
                  لا توجد ملاحظات
                </p>
              )}

              <AddNoteForm
                itemId={item._id}
                onAdded={onStatusChange}
              />
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 rounded-xl transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}