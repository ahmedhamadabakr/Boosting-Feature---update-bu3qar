import React from "react";
import CouponInput from "./CouponInput";
import { HiOutlineSupport, HiOutlineShieldCheck } from "react-icons/hi";

import { IoLogoWhatsapp } from "react-icons/io";
import { FiPhoneCall } from "react-icons/fi";

const OrderSummary = ({
  summaryRows = [],
  couponApplied,
  isExceeding,
  couponDiscount,
  discount,
  totalPrice,
  hasSelection,
  isLoading,
  couponRef,
  onApplyCoupon,
  onPay,
}) => {
  const phoneNumber = "+96597116767";

  return (
    <div className="lg:sticky lg:top-28 space-y-4 md:space-y-6 w-full">
      {/* Main card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-black/5 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <HiOutlineShieldCheck className="text-orange-500 text-2xl" />
          <h3 className="text-xl font-black text-gray-800">ملخص الطلب</h3>
        </div>

        {/* قائمة الخدمات المختارة */}
        {!hasSelection ? (
          <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 mb-6">
            <p className="text-sm text-gray-400 font-bold">لم تختر أي خدمة ترويجية بعد</p>
          </div>
        ) : (
          <ul className="space-y-4 mb-6">
            {summaryRows.map((row, i) => (
              <li key={i} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0">
                <span className="text-gray-500 text-sm">{row.label}</span>
                <span className="font-sans font-bold text-gray-800">{row.val} د.ك</span>
              </li>
            ))}
            {couponApplied && discount > 0 && (
              <li className="flex justify-between items-center pb-3 border-b border-gray-50 text-green-600 bg-green-50/50 p-2 rounded-lg text-xs font-bold">
                <span>خصم الكوبون ({couponDiscount}%)</span>
                <span className="font-sans font-bold">− {discount} د.ك</span>
              </li>
            )}
            <li className="flex justify-between items-center pt-4 border-t-2 border-gray-50">
              <span className="text-lg font-black">الإجمالي</span>
              <div className="text-left text-orange-600">
                <span className="font-sans text-3xl font-black">{Number(totalPrice).toFixed(2)}</span>
                <span className="font-bold text-sm mr-1">د.ك</span>
              </div>
            </li>
          </ul>
        )}

        <div className="mb-6">
          <CouponInput couponRef={couponRef} onApply={onApplyCoupon} applied={couponApplied} discount={couponDiscount} />
        </div>

        <button
          disabled={!hasSelection || isLoading || isExceeding}
          onClick={onPay}
          className={`w-full py-4 rounded-xl font-black text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isExceeding ? 'bg-gray-400 text-white shadow-none' : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98] shadow-orange-500/25'}`}
        >
          {isLoading ? "جاري المعالجة..." : "تأكيد التمييز (الدفع الآن)"}
        </button>
      </div>

      {/* Help & Contact Section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
            <HiOutlineSupport size={24} />
          </div>
          <div>
            <h5 className="font-bold text-gray-800 leading-tight">تحتاج مساعدة؟</h5>
            <p className="text-xs text-gray-500">تواصل مع مستشار التسويق لدينا</p>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${phoneNumber.replace('+', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-[#20bd5a] transition-colors shadow-sm shadow-green-200"
          >
            <IoLogoWhatsapp size={18} />
            واتساب
          </a>

          {/* Call Button */}
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
          >
            <FiPhoneCall size={16} />
            اتصال هاتفـي
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;