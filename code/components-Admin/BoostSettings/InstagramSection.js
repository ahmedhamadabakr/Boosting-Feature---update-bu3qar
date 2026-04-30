import { MdSlowMotionVideo, MdImage, MdMovie } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import SectionCard   from "./SectionCard";
import SectionHeader from "./SectionHeader";
import FieldInput from "./FieldInput";

const INSTA_TYPES = [
  { key: "story", label: "قصة (Story)",   icon: MdSlowMotionVideo },
  { key: "post",  label: "منشور (Post)",  icon: MdImage },
  { key: "reel",  label: "ريلز (Reel)",   icon: MdMovie },
];

const InstagramSection = ({ settings, onChange }) => {
  const set = (key) => (val) => onChange({ ...settings, [key]: val });

  const setType = (type, key) => (val) =>
    onChange({
      ...settings,
      [type]: { ...settings[type], [key]: val },
    });

  return (
    <SectionCard className="col-span-12 lg:col-span-5">
      <SectionHeader
        icon={<FaInstagram size={20} color="#ff5c00" />}
        title="ترويج انستقرام (Instagram)"
        description="ربط العقارات بمنصات التواصل الاجتماعي."
        enabled={settings.enabled}
        onToggle={set("enabled")}
      />
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

      <div className="space-y-3  mt-4">
        {INSTA_TYPES.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="p-4 bg-neutral-50 flex items-center justify-between group hover:bg-neutral-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-white flex items-center justify-center flex-shrink-0">
                <Icon
                  size={22}
                  color={settings[key].enabled ? "#ff5c00" : "#9ca3af"}
                />
              </div>
              <div>
                <p className="text-sm font-bold">{label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    min={1}
                    value={settings[key].price}
                    onChange={(e) => setType(key, "price")(Number(e.target.value))}
                    className="w-14 text-xs bg-transparent border-b border-neutral-300 focus:ring-0 focus:outline-none focus:border-[#ff5c00] p-0"
                  />
                  <span className="text-[10px] text-neutral-500">KWD</span>
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings[key].enabled}
              onChange={(e) => setType(key, "enabled")(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#ff5c00]"
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default InstagramSection;
