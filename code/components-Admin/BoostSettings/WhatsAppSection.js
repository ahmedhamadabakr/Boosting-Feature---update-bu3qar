import { FaWhatsapp } from "react-icons/fa";
import SectionCard from "./SectionCard";
import SectionHeader from "./SectionHeader";
import FieldInput from "./FieldInput";
import { DAYS_OF_WEEK } from "./constants";
import Toggle from "../../Shared/Toggle";

/* ───────────── NumCell (Validation + UX) ───────────── */
const NumCell = ({ value, onChange, disabled, placeholder = "1" }) => {
  const handleChange = (val) => {
    if (val === "") return onChange("");
    const num = Number(val);
    if (num < 1) return onChange(1);
    onChange(num);
  };

  return (
    <input
      type="number"
      min={1}
      value={value ?? ""}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => handleChange(e.target.value)}
      className={`w-full bg-transparent text-center text-sm font-semibold
        ${disabled ? "text-neutral-400 cursor-not-allowed" : "text-neutral-700"}
        border-b border-neutral-200 focus:border-[#25D366] focus:outline-none
        py-1 transition-all duration-200 placeholder:text-neutral-300
        hover:border-neutral-300`}
    />
  );
};

const WhatsAppSection = ({ settings, onChange }) => {
  const set = (key) => (val) => onChange({ ...settings, [key]: val });

  /* Toggle day */
  const toggleDay = (key) =>
    onChange({
      ...settings,
      workingDays: {
        ...settings.workingDays,
        [key]: {
          ...(settings.workingDays[key] ?? {}),
          enabled: !(settings.workingDays[key]?.enabled ?? true),
        },
      },
    });

  /* Update field */
  const setDayField = (key, field) => (val) =>
    onChange({
      ...settings,
      workingDays: {
        ...settings.workingDays,
        [key]: {
          ...(settings.workingDays[key] ?? {}),
          [field]: val,
        },
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

      {/* Title & Description */}
      <FieldInput
        label="عنوان الباقة"
        value={settings.title}
        onChange={set("title")}
      />
      <FieldInput
        label="الوصف"
        value={settings.description}
        onChange={set("description")}
        textarea
      />

      {/* ───────────── Table ───────────── */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200">
              <th className="text-right px-4 py-3 text-xs font-bold text-neutral-500 w-12">
                تفعيل
              </th>
              <th className="text-right px-4 py-3 text-xs font-bold text-neutral-500">
                اليوم
              </th>
              <th className="text-center px-4 py-3 text-xs font-bold text-neutral-500">
                السعر (KWD)
              </th>
              <th className="text-center px-4 py-3 text-xs font-bold text-neutral-500">
                عدد المستلمين
              </th>
              <th className="text-center px-4 py-3 text-xs font-bold text-neutral-500">
                مرات الإرسال / اليوم
              </th>
            </tr>
          </thead>

          <tbody>
            {DAYS_OF_WEEK.map(({ key, label }, idx) => {
              const day = settings.workingDays?.[key] ?? {};
              const active = day.enabled ?? true;

              return (
                <tr
                  key={key}
                  className={`border-b border-neutral-100 transition-all duration-200
                    ${idx % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}
                    ${active ? "hover:bg-neutral-50" : "opacity-40 grayscale"}
                  `}
                >
                  {/* Toggle */}
                  <td className="px-4 py-3 text-center align-middle">
                    <Toggle
                      checked={active}
                      onChange={() => toggleDay(key)}
                      activeColor="#25D366"
                    />
                  </td>

                  {/* Day */}
                  <td className="px-4 py-3 align-middle">
                    <span
                      className={`font-medium ${
                        active ? "text-neutral-800" : "text-neutral-400"
                      }`}
                    >
                      {label}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-center align-middle">
                    <NumCell
                      value={day.price}
                      onChange={setDayField(key, "price")}
                      disabled={!active}
                      placeholder="1"
                    />
                  </td>

                  {/* Recipients */}
                  <td className="px-4 py-3 text-center align-middle">
                    <NumCell
                      value={day.dailyCap}
                      onChange={setDayField(key, "dailyCap")}
                      disabled={!active}
                      placeholder="100"
                    />
                  </td>

                  {/* Send times */}
                  <td className="px-4 py-3 text-center align-middle">
                    <NumCell
                      value={day.sendTimes}
                      onChange={setDayField(key, "sendTimes")}
                      disabled={!active}
                      placeholder="1"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ───────────── Summary ───────────── */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-neutral-500">
        <span>
          أيام مفعّلة:{" "}
          <strong className="text-neutral-700">
            {
              DAYS_OF_WEEK.filter(
                ({ key }) => settings.workingDays?.[key]?.enabled ?? true
              ).length
            }
          </strong>
        </span>

        <span>
          إجمالي المستلمين:{" "}
          <strong className="text-neutral-700">
            {DAYS_OF_WEEK.reduce((sum, { key }) => {
              const day = settings.workingDays?.[key] ?? {};
              if (!(day.enabled ?? true)) return sum;
              return sum + (Number(day.dailyCap) || 0);
            }, 0).toLocaleString("ar-KW")}
          </strong>
        </span>

        <span>
          إجمالي التكلفة:{" "}
          <strong className="text-neutral-700">
            {DAYS_OF_WEEK.reduce((sum, { key }) => {
              const day = settings.workingDays?.[key] ?? {};
              if (!(day.enabled ?? true)) return sum;
              return sum + (Number(day.price) || 0);
            }, 0).toFixed(3)}{" "}
            د.ك
          </strong>
        </span>
      </div>
    </SectionCard>
  );
};

export default WhatsAppSection;