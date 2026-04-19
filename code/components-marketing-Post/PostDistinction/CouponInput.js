import React from 'react';
import { HiOutlineTicket, HiCheckCircle } from 'react-icons/hi';
import { FiArrowLeft } from 'react-icons/fi';

const CouponInput = ({ couponRef, onApply, applied, discount }) => {
  const handleApply = () => {
    const couponCode = couponRef?.current?.value?.trim();
    
    if (couponCode && couponCode.length === 6) {
      onApply(couponCode);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
  
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2.5 transition-all">
        <HiOutlineTicket className="text-lg text-orange-500" />
        كوبون الخصم
      </label>

      <div className="relative flex flex-col sm:flex-row gap-2 transition-all">
        <div className="relative flex-1">
          <input
            ref={couponRef}
            type="text"
            maxLength={6}
            placeholder="أدخل الكود (6 رموز)"
            disabled={applied}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              if (e.target.value.length === 6) {
                handleApply();
              }
            }}
            className={`w-full p-3 pr-4 border rounded-xl text-sm font-medium transition-all duration-300 outline-none
              ${
                applied
                  ? "bg-green-50 border-green-500 text-green-700 ring-2 ring-green-100"
                  : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50/50 hover:border-gray-300"
              }`}
          />
          {applied && (
            <HiCheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 text-xl" />
          )}
        </div>

        <button
          onClick={handleApply}
          disabled={applied}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300
            ${
              applied
                ? "bg-green-500 text-white cursor-default"
                : "bg-gray-900 text-white hover:bg-orange-600 active:scale-95 shadow-sm hover:shadow-orange-200"
            } disabled:opacity-100`}
        >
          {applied ? (
            "مُفعّل"
          ) : (
            <>
              تطبيق
              <FiArrowLeft className="hidden sm:block mt-0.5" />
            </>
          )}
        </button>
      </div>

      {applied && (
        <div className="flex items-center gap-1.5 mt-3 py-2 px-3 bg-green-50/50 border border-dashed border-green-200 rounded-lg animate-fade-in">
          <span className="text-green-700 text-xs font-bold leading-none">
            تهانينا! تم تطبيق خصم {discount}% بنجاح
          </span>
        </div>
      )}
    </div>
  );
};

export default CouponInput;