import { MdRocketLaunch } from "react-icons/md";
import SectionCard   from "./SectionCard";
import SectionHeader from "./SectionHeader";
import FieldInput    from "./FieldInput";

const InAppBoostSection = ({ settings, onChange }) => {
  const set = (key) => (val) => onChange({ ...settings, [key]: val });

  return (
    <SectionCard accent className="col-span-12">
      <SectionHeader
        icon={<MdRocketLaunch size={22} color="#ff5c00" />}
        title="الترويج داخل التطبيق (In-App Boost)"
        description="تعديل أسعار ومدد الترويج الأساسية للعقارات داخل المنصة."
        enabled={settings.enabled}
        onToggle={set("enabled")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Text fields */}
        <div className="space-y-5">
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
        </div>

        {/* Number fields */}
        <div className="grid grid-cols-2 gap-6 content-start">
          <FieldInput
            label="المدة الأساسية (أيام)"
            value={settings.baseDays}
            onChange={set("baseDays")}
            type="number"
            unit="أيام"
          />
          <FieldInput
            label="السعر الأساسي"
            value={settings.basePrice}
            onChange={set("basePrice")}
            type="number"
            unit="KWD"
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default InAppBoostSection;
