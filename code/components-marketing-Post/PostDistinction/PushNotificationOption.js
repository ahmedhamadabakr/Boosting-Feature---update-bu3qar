import React from "react";
import Toggle from "../../../Shared/Toggle";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { MdBolt, MdLock } from "react-icons/md";
import { DEFAULT_SETTINGS } from "@/components/Admin/BoostSettings/constants";
import { dateFormat } from "@/utils/dateFormat";

const PushNotificationOption = ({
  active,
  onToggle,
  isUrgent,
  onUrgentToggle,
  nextSlot,
  urgentSlotsUsed = 0,
}) => {
  const urgentMax = DEFAULT_SETTINGS.push.urgentMax ?? 3;
  const urgentSoldOut = urgentSlotsUsed >= urgentMax;
  const urgentRemaining = Math.max(0, urgentMax - urgentSlotsUsed);

  // تعريف السعر النهائي بناءً على نوع التنبيه المختار
  const finalPrice = isUrgent
    ? DEFAULT_SETTINGS.push.urgentPrice
    : DEFAULT_SETTINGS.push.price;

  const handleSelectNormal = () => {
    onToggle();
  };

  const handleSelectUrgent = () => {
    if (!urgentSoldOut) {
      onUrgentToggle();
    }
  };

  return (
    <div className={`bg-white rounded-3xl border transition-all p-5 md:p-6 ${active ? 'border-orange-500 shadow-sm' : 'border-gray-100'}`}>

      {/* ── Top Row ── */}
      <div className="flex items-center justify-between">
        <Toggle checked={active} onChange={onToggle} />

        <div className="flex-1 px-4">
          <h4 className="text-lg font-black text-gray-900">
            {DEFAULT_SETTINGS.push.title}
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            {DEFAULT_SETTINGS.push.description}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <HiOutlineBellAlert className="text-gray-600 text-xl" />
        </div>
      </div>

      {/* ── Price ── */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xl font-black text-gray-900">
          {finalPrice}
        </span>
        <span className="text-sm text-gray-500 font-bold">د.ك</span>
      </div>

      {/* ── Selection Cards ── */}
      {active && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          
          {/* Normal Option Card */}
          <div 
            onClick={handleSelectNormal}
            className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              !isUrgent 
                ? "border-orange-500 bg-orange-50/30 shadow-sm" 
                : "border-gray-100 bg-white hover:border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-black ${!isUrgent ? 'text-orange-900' : 'text-gray-700'}`}>تنبيه عادي</span>
              {!isUrgent && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
            </div>
            <p className="text-[11px] text-gray-500">يصل في الموعد المجدول القادم</p>
            
            {nextSlot && (
              <div className="mt-3 text-[10px] text-orange-700 bg-orange-100/50 px-2 py-1 rounded-md border border-orange-100">
                {nextSlot.date} — {nextSlot.time}
              </div>
            )}
          </div>

          {/* Urgent Option Card */}
          <div 
            onClick={handleSelectUrgent}
            className={`relative p-4 rounded-2xl border-2 transition-all ${
              urgentSoldOut 
                ? "border-gray-50 bg-gray-50 opacity-60 cursor-not-allowed" 
                : isUrgent 
                ? "border-red-500 bg-red-50/30 shadow-sm cursor-pointer" 
                : "border-gray-100 bg-white hover:border-red-100 cursor-pointer"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1">
                {urgentSoldOut ? <MdLock className="text-gray-400" /> : <MdBolt className={isUrgent ? "text-red-600" : "text-gray-400"} />}
                <span className={`text-sm font-black ${urgentSoldOut ? 'text-gray-400' : isUrgent ? 'text-red-900' : 'text-gray-700'}`}>
                  تنبيه عاجل
                </span>
              </div>
              {isUrgent && !urgentSoldOut && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            </div>
            <p className="text-[11px] text-gray-500">يتجاوز قائمة الانتظار ويرسل فوراً</p>
            
            <div>
              {urgentSoldOut ? (
                <div className="mt-3 text-[10px] font-bold text-gray-400 bg-gray-200/50 px-2 py-1 rounded-md text-center italic">
                  نفدت الكمية لليوم
                </div>
              ) : (
                <div className={`mt-3 text-[10px] font-bold px-2 py-1 rounded-md flex justify-between items-center ${
                  isUrgent ? 'bg-red-100 text-red-700' : 'bg-red-50 text-red-500'
                }`}>
                  <span>متاح: {urgentRemaining}</span>
                  <span>{DEFAULT_SETTINGS.push.urgentPrice} د.ك</span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default PushNotificationOption;