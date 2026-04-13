import React from 'react';
import { HiOutlineLightningBolt, HiPlus, HiMinus } from 'react-icons/hi';
import { FiInfo } from 'react-icons/fi';

const InAppBoost = ({ inAppDays, onDayChange }) => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow">
   
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
            <HiOutlineLightningBolt size={28} />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              تمييز الإعلان داخل التطبيق
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1">
              <FiInfo className="text-orange-400" />
              يظهر إعلانك في مقدمة نتائج البحث
            </p>
          </div>
        </div>
        
        <div className="bg-orange-50 px-4 py-2 rounded-xl self-end sm:self-start border border-orange-100">
          <div className="flex items-baseline gap-1">
            <span className="font-sans text-2xl font-black text-orange-600">5</span>
            <span className="text-xs font-bold text-orange-500">د.ك</span>
          </div>
          <span className="text-[10px] block text-center font-bold text-orange-400 uppercase tracking-tighter">
            لكل 3 أيام
          </span>
        </div>
      </div>

   
      <div className="flex flex-wrap items-center justify-between border-t border-gray-50 pt-5 gap-4">
        <span className="font-bold text-gray-700">مدة التمييز</span>
        
        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
     
          <button
            onClick={() => onDayChange(false)}
            disabled={inAppDays <= 3}
            className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Decrease days"
          >
            <HiMinus size={20} />
          </button>

    
          <div className="flex flex-col items-center min-w-[60px]">
            <span className="font-sans text-xl font-black text-gray-900 leading-none">
              {inAppDays}
            </span>
            <span className="text-[10px] font-bold text-gray-400">يوم</span>
          </div>

          <button
            onClick={() => onDayChange(true)}
            className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-900 hover:text-orange-600 hover:bg-orange-50 transition-all active:scale-90"
            aria-label="Increase days"
          >
            <HiPlus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InAppBoost;