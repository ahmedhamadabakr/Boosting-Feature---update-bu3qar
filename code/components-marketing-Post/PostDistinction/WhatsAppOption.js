import React from "react";
import Toggle from "./Toggle";
import { RiWhatsappLine } from "react-icons/ri";


const WhatsAppOption = ({ active, onToggle }) => {
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
        
       
        <div className="flex items-center gap-3 md:gap-4 flex-grow min-w-0">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            active ? "bg-[#25D366] text-white" : "bg-green-50 text-[#25D366]"
          }`}>
            <RiWhatsappLine className="text-2xl md:text-3xl" />
          </div>
          
          <div className="min-w-0 text-right">
            <h4 className="text-base md:text-lg font-black text-gray-900 truncate">
              برودكاست واتساب
            </h4>
            <p className="text-xs text-gray-500 truncate">
              إرسال العقار لمجموعات المستثمرين والمهتمين
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 mr-auto pl-2 border-r pr-4 border-gray-100">
          <div className="text-left hidden xs:block">
            <span className="font-sans text-xl font-black text-gray-800">2</span>
            <span className="text-[10px] font-bold text-gray-500 mr-1">د.ك</span>
          </div>
    
          <div className="pointer-events-none">
            <Toggle on={active} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default WhatsAppOption;