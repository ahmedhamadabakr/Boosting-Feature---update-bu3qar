import React from "react";
import Toggle from "./Toggle";
import { HiOutlineBellAlert } from "react-icons/hi2";

const PushNotificationOption = ({ active, onToggle }) => {
  return (
    <div
  onClick={onToggle}
  className={`group p-4 md:p-6 rounded-2xl transition-all duration-300 cursor-pointer border-2 select-none overflow-hidden ${
    active
      ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-500/5"
      : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50 shadow-sm"
  }`}
>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        {/* Left Side: Icon & Content */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
            active ? "bg-orange-500 text-white" : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
          }`}>
            <HiOutlineBellAlert className="w-7 h-7" />
          </div>
          
          <div className="flex-1">
            <h4 className="text-lg md:text-xl font-black text-gray-900 leading-tight">
              تنبيهات مباشرة (Push)
            </h4>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              إرسال تنبيه فوري لآلاف المستخدمين المهتمين
            </p>
          </div>
        </div>

        {/* Right Side: Price & Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 flex-shrink-0">
          <div className="flex flex-col sm:items-end">
            <div className="flex items-baseline gap-1 text-gray-800">
              <span className="font-sans text-2xl font-black">3</span>
              <span className="text-xs font-bold text-gray-500">د.ك</span>
            </div>
            {active && (
              <span className="text-[10px] text-orange-600 font-bold animate-pulse">
                تم الاختيار
              </span>
            )}
          </div>
          
         <div className="flex items-center justify-center w-12 h-6">
  <Toggle on={active} />
</div>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationOption;