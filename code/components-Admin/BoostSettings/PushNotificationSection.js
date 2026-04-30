import { useState } from "react";
import { MdNotificationsActive, MdBolt, MdClose, MdAdd } from "react-icons/md";
import SectionCard from "./SectionCard";
import SectionHeader from "./SectionHeader";
import FieldInput from "./FieldInput";

const PushNotificationSection = ({ settings, onChange }) => {
  const [newTime, setNewTime] = useState("");

  const set = (key) => (val) => {
    let safeValue = val;

    if (typeof val === "number") {
      safeValue = Math.max(0, val);
    }

    onChange({ ...settings, [key]: safeValue });
  };

  const addTime = () => {
    if (!newTime) return;

    if (!settings.times.includes(newTime)) {
      const updatedTimes = [...settings.times, newTime].sort();
      onChange({ ...settings, times: updatedTimes });
    }

    setNewTime("");
  };

  const removeTime = (t) => {
    onChange({
      ...settings,
      times: settings.times.filter((x) => x !== t),
    });
  };

  return (
    <SectionCard className="col-span-12 lg:col-span-7 bg-neutral-50">
      <SectionHeader
        icon={<MdNotificationsActive size={22} color="#ff5c00" />}
        title="تنبيهات الهاتف (Push Notifications)"
        description="إدارة الحملات المنبثقة وجدولة مواعيدها."
        enabled={settings.enabled}
        onToggle={set("enabled")}
        activeColor="#ff5c00"
      />
      <FieldInput
        label="عنوان الباقة"
        value={settings.title}
        onChange={set("title")}
      />
      <div>
        <label className="block text-xs font-bold text-neutral-500 mb-2">الوصف</label>
        <textarea
          value={settings.description}
          onChange={(e) => set("description")(e.target.value)}
          rows={3}
          className="w-full border-b border-neutral-300 py-2 bg-transparent resize-none focus:outline-none focus:border-[#ff5c00]"
        />
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <FieldInput
              label="السعر الاعتيادي (لكل تنبيه)"
              value={settings.price}
              onChange={set("price")}
              type="number"
              unit="KWD"
              min={0}
            />
          </div>

          <FieldInput
            label="عدد المقاعد اليومية"
            value={settings.dailySlots}
            onChange={set("dailySlots")}
            type="number"
            min={0}
          />

          {/* Time slots */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-2">
              فترات الإرسال المتاحة
            </label>

            <div className="flex flex-wrap gap-2 pt-1">
              {settings.times.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 px-3 py-1 bg-white border border-neutral-200 text-xs rounded"
                >
                  {t}
                  <button
                    onClick={() => removeTime(t)}
                    className="text-red-500 hover:text-red-700 leading-none"
                  >
                    <MdClose size={12} />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTime()}
                  className="w-28 text-xs border-b border-neutral-300 bg-transparent py-1 focus:outline-none focus:border-[#ff5c00]"
                />

                <button
                  onClick={addTime}
                  className="px-2 py-1 bg-neutral-900 text-white text-xs flex items-center gap-1 hover:bg-neutral-700 transition-colors rounded"
                >
                  <MdAdd size={14} /> إضافة
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Urgent push subsection */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <h4 className="text-sm font-bold text-red-600 mb-4 flex items-center gap-2">
            <MdBolt size={18} color="#dc2626" />
            إعدادات التنبيه العاجل (Urgent)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-red-50 rounded">
            <FieldInput
              label="سعر التنبيه العاجل"
              value={settings.urgentPrice}
              onChange={set("urgentPrice")}
              type="number"
              unit="KWD"
              focusColor="#dc2626"
              inputClassName="text-red-600 font-bold"
              min={0}
            />

            <FieldInput
              label="الحد الأقصى يومياً"
              value={settings.urgentMax}
              onChange={set("urgentMax")}
              type="number"
              focusColor="#dc2626"
              min={0}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default PushNotificationSection;