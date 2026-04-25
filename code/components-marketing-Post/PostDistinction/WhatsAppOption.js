import React from "react";
import Toggle from "../../../Shared/Toggle";
import { RiWhatsappLine } from "react-icons/ri";
import { DEFAULT_SETTINGS } from "@/components/Admin/BoostSettings/constants";
import { dateFormat } from "@/utils/dateFormat";

const WhatsAppOption = ({ active, onToggle = () => {}, nextSlot }) => {
  const whatsapp = DEFAULT_SETTINGS.whatsapp;
  const isToday = nextSlot && nextSlot.date === dateFormat(new Date());

  // لو الخدمة مقفولة من settings
  if (!whatsapp?.enabled) return null;

  return (
    <div
      onClick={onToggle}
      className={`relative group p-4 md:p-5 rounded-2xl transition-all duration-200 cursor-pointer border-2 select-none active:scale-[0.98] ${
        active
          ? "border-orange-500 bg-orange-50/50"
          : "border-gray-100 bg-white hover:border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between gap-4">

        {/* Left Section */}
        <div className="flex items-center gap-3 md:gap-4 flex-grow min-w-0">
          
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              active
                ? "bg-[#25D366] text-white"
                : "bg-green-50 text-[#25D366]"
            }`}
          >
            <RiWhatsappLine className="text-2xl md:text-3xl" />
          </div>

          {/* Text */}
          <div className="min-w-0 text-right">
            <h4 className="text-base md:text-lg font-black text-gray-900 truncate">
              {whatsapp.title}
            </h4>

            <p className="text-xs text-gray-500 truncate">
              {whatsapp.description}
            </p>

            {/* Next Slot */}
            {active && nextSlot && (
              <div className="mt-2 text-xs text-orange-700 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                <span className="font-bold">
                  موعد البث المجدول:
                </span>
                <span>
                  {nextSlot.date} — {nextSlot.time}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 flex-shrink-0 mr-auto pl-2 border-r pr-4 border-gray-100">

          {/* Price */}
      <div className="text-left hidden sm:block">
            <span className="font-sans text-xl font-black text-gray-800">
              {whatsapp.price}
            </span>
            <span className="text-[10px] font-bold text-gray-500 mr-1">
              د.ك
            </span>
          </div>

          {/* Selected Label */}
          {active && (
            <span className="text-[10px] text-orange-600 font-bold animate-pulse">
              تم الاختيار
            </span>
          )}

          {/* Toggle */}
          <div
            className="pointer-events-none"
            onClick={(e) => e.stopPropagation()} // 
          >
            <Toggle checked={active} onChange={onToggle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppOption;