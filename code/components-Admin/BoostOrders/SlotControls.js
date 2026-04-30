import { useState } from "react";
import toast from "react-hot-toast";
import { fetcher } from "@/lib/fetch";

// ── Create single slot ────────────────────────────────────────────────────────
function CreateSlotForm({ onCreated }) {
  const [form, setForm]     = useState({ date: "", time: "09:00", capacity: 5 });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.time) return toast.error("أدخل التاريخ والوقت");
    setLoading(true);
    try {
      await fetcher("/api/admin/queue/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toast.success("تم إنشاء الـ slot");
      setForm({ date: "", time: "09:00", capacity: 5 });
      onCreated?.();
    } catch (err) {
      toast.error(err?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">التاريخ</label>
        <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
          className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-orange-300" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">الوقت</label>
        <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)}
          className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-orange-300" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">الـ Capacity</label>
        <input type="number" min={1} max={50} value={form.capacity} onChange={(e) => set("capacity", Number(e.target.value))}
          className="border border-gray-200 rounded-lg text-sm py-2 px-3 w-20 focus:outline-none focus:ring-1 focus:ring-orange-300" />
      </div>
      <button type="submit" disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition">
        {loading ? "..." : "+ إنشاء Slot"}
      </button>
    </form>
  );
}

// ── Seed bulk slots ───────────────────────────────────────────────────────────
function SeedForm({ onSeeded }) {
  const [days, setDays]       = useState(7);
  const [cap, setCap]         = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetcher("/api/admin/queue/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daysAhead: days, capacity: cap }),
      });
      toast.success(`تم إنشاء ${res.upsertedCount} slot جديد`);
      onSeeded?.();
    } catch (err) {
      toast.error(err?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">عدد الأيام</label>
        <input type="number" min={1} max={30} value={days} onChange={(e) => setDays(Number(e.target.value))}
          className="border border-gray-200 rounded-lg text-sm py-2 px-3 w-20 focus:outline-none focus:ring-1 focus:ring-orange-300" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">الـ Capacity لكل Slot</label>
        <input type="number" min={1} max={50} value={cap} onChange={(e) => setCap(Number(e.target.value))}
          className="border border-gray-200 rounded-lg text-sm py-2 px-3 w-20 focus:outline-none focus:ring-1 focus:ring-orange-300" />
      </div>
      <button onClick={handleSeed} disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition">
        {loading ? "..." : "🌱 Seed Slots"}
      </button>
    </div>
  );
}

// ── Edit Capacity Modal ───────────────────────────────────────────────────────
export function EditCapacityModal({ slot, onClose, onSaved }) {
  const [cap, setCap]         = useState(slot.capacity);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (cap < slot.bookedCount) {
      return toast.error(`لا يمكن تقليل الـ capacity عن ${slot.bookedCount} (محجوز حالياً)`);
    }
    setLoading(true);
    try {
      await fetcher(`/api/admin/queue/slots/${slot._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capacity: cap }),
      });
      toast.success("تم تحديث الـ capacity");
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs mx-4" dir="rtl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-gray-800 mb-4">تعديل الـ Capacity</h3>
        <p className="text-xs text-gray-500 mb-3">
          Slot: <strong>{slot.date} {slot.time}</strong> — محجوز: <strong>{slot.bookedCount}</strong>
        </p>
        <input type="number" min={slot.bookedCount} max={50} value={cap}
          onChange={(e) => setCap(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-lg text-sm py-2 px-3 mb-4 focus:outline-none focus:ring-1 focus:ring-orange-300" />
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={loading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm py-2 rounded-xl transition">
            {loading ? "..." : "حفظ"}
          </button>
          <button onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 rounded-xl transition">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function SlotControls({ onRefresh }) {
  const [tab, setTab] = useState("create"); // "create" | "seed"

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-3">
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-sm font-semibold text-gray-700">إدارة الـ Slots</h2>
        <div className="flex gap-1">
          {["create", "seed"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs px-3 py-1 rounded-full transition ${tab === t ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {t === "create" ? "إنشاء Slot" : "Seed تلقائي"}
            </button>
          ))}
        </div>
      </div>

      {tab === "create" ? (
        <CreateSlotForm onCreated={onRefresh} />
      ) : (
        <SeedForm onSeeded={onRefresh} />
      )}
    </div>
  );
}
