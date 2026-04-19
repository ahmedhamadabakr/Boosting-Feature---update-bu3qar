import { FaWhatsapp } from "react-icons/fa";
import SectionCard   from "./SectionCard";
import SectionHeader from "./SectionHeader";
import FieldInput    from "./FieldInput";
import { DAYS_OF_WEEK } from "./constants";

const WhatsAppSection = ({ settings, onChange }) => {
  const set = (key) => (val) => onChange({ ...settings, [key]: val });

  const toggleDay = (key) =>
    onChange({
      ...settings,
      workingDays: {
        ...settings.workingDays,
        [key]: !settings.workingDays[key],
      },
    });

  return (
    <SectionCard className="col-span-12">
      <SectionHeader
        icon={<FaWhatsapp size={22} color="#25D366" />}
        title="بث واتساب (WhatsApp Broadcast)"
        description="إرسال تفاصيل العقار إلى قوائم المشتركين المهتمين."
        enabled={settings.enabled}
        onToggle={set("enabled")}
        activeColor="#25D366"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Price & capacity */}
        <div className="space-y-6">
          <FieldInput
            label="سعر الحملة"
            value={settings.price}
            onChange={set("price")}
            type="number"
            unit="KWD"
            focusColor="#25D366"
          />
          <FieldInput
            label="الطاقة اليومية (عدد المستلمين)"
            value={settings.dailyCap}
            onChange={set("dailyCap")}
            type="number"
            focusColor="#25D366"
          />
        </div>

        {/* Working days */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-neutral-500 mb-4">
            أيام عمل الحملات
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {DAYS_OF_WEEK.map(({ key, label }) => {
              const active = settings.workingDays[key];
              return (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 cursor-pointer border transition-colors ${
                    active
                      ? "bg-green-50 border-[#25D366]"
                      : "bg-neutral-100 border-transparent hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleDay(key)}
                    className="w-4 h-4 cursor-pointer accent-[#25D366]"
                  />
                  <span
                    className={`text-sm ${active ? "font-medium" : "text-neutral-400"}`}
                  >
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default WhatsAppSection;
