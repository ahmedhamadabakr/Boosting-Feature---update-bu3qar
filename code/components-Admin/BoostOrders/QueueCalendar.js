import { useState } from "react";
import BoostItemModal from "./BoostItemModal";
import { HiPencil, HiTrash } from "react-icons/hi";
import { MdBolt } from "react-icons/md";

// ── Slot fill color ───────────────────────────────────────────────────────────
function slotColor(booked, capacity) {
  if (capacity === 0) return { bar: "bg-gray-200", badge: "bg-gray-100 text-gray-500", label: "" };
  const pct = booked / capacity;
  if (pct >= 1)   return { bar: "bg-red-500",    badge: "bg-red-100 text-red-700",    label: "ممتلئ" };
  if (pct >= 0.6) return { bar: "bg-yellow-400", badge: "bg-yellow-100 text-yellow-700", label: "قريب من الامتلاء" };
  return           { bar: "bg-green-400",  badge: "bg-green-100 text-green-700",  label: "" };
}

// ── Single Slot Card ──────────────────────────────────────────────────────────
function SlotCard({ slot, onEditCapacity, onDeleteSlot }) {
  const { bar, badge, label } = slotColor(slot.bookedCount, slot.capacity);
  const isFull = slot.bookedCount >= slot.capacity;
  const pct = slot.capacity > 0 ? Math.round((slot.bookedCount / slot.capacity) * 100) : 0;

  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className={`border rounded-xl p-3 mb-2 bg-white shadow-sm ${isFull ? "border-red-200" : "border-gray-100"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-800">{slot.time}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
            {slot.bookedCount}/{slot.capacity} {label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEditCapacity(slot)}
            className="text-gray-400 hover:text-orange-500 p-1 transition"
            title="تعديل الـ capacity"
          >
            <HiPencil size={16} />
          </button>
          <button
            onClick={() => onDeleteSlot(slot)}
            className="text-gray-400 hover:text-red-500 p-1 transition"
            title="حذف الـ slot"
          >
            <HiTrash size={16} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
        <div className={`h-1.5 rounded-full transition-all ${bar}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>

      {/* Items */}
      {slot.itemsData?.length > 0 ? (
        <div className="flex flex-wrap gap-1 mt-1">
          {slot.itemsData.map((item) => (
            <button
              key={item._id}
              onClick={() => setSelectedItem(item)}
              title={`${item.advertiser?.username || "—"} | ${item.listing?.title || "—"}`}
              className={`
                text-xs px-2 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1
                ${item.isUrgent ? "bg-red-50 border-red-200 text-red-700" : "bg-gray-50 border-gray-200 text-gray-700"}
                hover:shadow-sm hover:border-orange-300
              `}
            >
              {item.isUrgent && <MdBolt size={14} />}
              {item.listing?.title
                ? item.listing.title.length > 18
                  ? item.listing.title.slice(0, 18) + "…"
                  : item.listing.title
                : item.orderId}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-300 mt-1">لا توجد طلبات</p>
      )}

      {/* Item detail modal */}
      {selectedItem && (
        <BoostItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

// ── Day Column ────────────────────────────────────────────────────────────────
function DayColumn({ day, onEditCapacity, onDeleteSlot }) {
  const totalBooked   = day.slots.reduce((s, sl) => s + sl.bookedCount, 0);
  const totalCapacity = day.slots.reduce((s, sl) => s + sl.capacity, 0);

  const dateObj = new Date(day.date + "T00:00:00");
  const label   = dateObj.toLocaleDateString("ar-KW", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="min-w-[220px] flex-1">
      {/* Day header */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-xs text-gray-400">{totalBooked}/{totalCapacity}</span>
      </div>

      {day.slots.length === 0 ? (
        <p className="text-xs text-gray-300 text-center py-4">لا توجد slots</p>
      ) : (
        day.slots.map((slot) => (
          <SlotCard
            key={slot._id}
            slot={slot}
            onEditCapacity={onEditCapacity}
            onDeleteSlot={onDeleteSlot}
          />
        ))
      )}
    </div>
  );
}

// ── Main Calendar ─────────────────────────────────────────────────────────────
export default function QueueCalendar({ days, onEditCapacity, onDeleteSlot }) {
  if (!days || days.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>لا توجد slots في هذه الفترة</p>
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4" dir="rtl">
      {days.map((day) => (
        <DayColumn
          key={day.date}
          day={day}
          onEditCapacity={onEditCapacity}
          onDeleteSlot={onDeleteSlot}
        />
      ))}
    </div>
  );
}