import React from "react";
import Toggle from "../../../Shared/Toggle";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { MdBolt } from "react-icons/md";

const PushNotificationOption = ({
  active,
  onToggle,
  isUrgent,
  onUrgentToggle,
  nextSlot,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 transition-all">
      
      {/* Top Row */}
      <div className="flex items-center justify-between">
        
        {/* Right: Toggle */}
        <Toggle checked={active} onChange={onToggle} />

        {/* Center: Content */}
        <div className="flex-1 px-4">
          <h4 className="text-lg font-black text-gray-900">
            تنبيهات مباشرة (Push)
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            إرسال تنبيه فوري لآلاف المهتمين في منطقتك
          </p>
        </div>

        {/* Left: Icon */}
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <HiOutlineBellAlert className="text-gray-600 text-xl" />
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xl font-black text-gray-900">3</span>
        <span className="text-xs text-gray-500 font-bold">د.ك</span>
      </div>

      {/* Urgent Badge */}
      <div className="flex items-center gap-2 mt-3">
        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
          عاجل
        </span>
        <span className="text-xs text-gray-600">
          تنبيه فوري الآن (+8 د.ك)
        </span>
      </div>

      {/* Next Slot */}
      {active && nextSlot && (
        <div className="mt-3 text-xs text-gray-600 bg-gray-100 px-3 py-2 rounded-lg inline-flex items-center gap-2">
          <span className="font-bold text-gray-700">الموعد القادم:</span>
          <span>
            {nextSlot.date} — {nextSlot.time}
          </span>
        </div>
      )}

      {/* Urgent Toggle */}
      {active && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onUrgentToggle();
          }}
          className={`mt-4 flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
            isUrgent
              ? "bg-red-50 border-red-300"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <MdBolt
              className={`text-lg ${
                isUrgent ? "text-red-600" : "text-gray-400"
              }`}
            />
            <span
              className={`text-sm font-bold ${
                isUrgent ? "text-red-600" : "text-gray-700"
              }`}
            >
              تنبيه عاجل
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-800">8 د.ك</span>
            <Toggle checked={isUrgent} onChange={onUrgentToggle} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PushNotificationOption;