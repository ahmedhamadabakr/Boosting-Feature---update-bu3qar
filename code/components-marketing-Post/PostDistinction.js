import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

import { HiOutlineSparkles, HiOutlineCheckCircle } from "react-icons/hi";
import { RiAdvertisementLine } from "react-icons/ri";

// Sub-components
import ListingPreview from "./PostDistinction/ListingPreview.js";
import InAppBoost from "./PostDistinction/InAppBoost.js";
import PushNotificationOption from "./PostDistinction/PushNotificationOption.js";
import InstagramOption from "./PostDistinction/InstagramOption.js";
import WhatsAppOption from "./PostDistinction/WhatsAppOption.js";
import TagInput from "./PostDistinction/TagInput.js";
import OrderSummary from "./PostDistinction/OrderSummary.js";

// Custom hooks
import useRemainingDays from "@/utils/hooks/useRemainingDays";
import useInAppDays from "@/utils/hooks/useInAppDays";
import useSelectedOptions from "@/utils/hooks/useSelectedOptions";
import usePriceCalculation from "@/utils/hooks/usePriceCalculation";
import useOrderSummary from "@/utils/hooks/useOrderSummary";
import useSlotCalculation from "@/utils/hooks/useSlotCalculation";
import usePaymentProcess from "@/utils/hooks/usePaymentProcess";
import useDistinctionCoupon from "@/utils/hooks/useDistinctionCoupon";

const PostDistinction = ({ post, user }) => {
  // State Management
  const [tag, setTag] = useState("");
  const [tagErr, setTagErr] = useState(false);
  const couponRef = useRef(null);

  // Custom hooks
  const remainingDays = useRemainingDays(post);
  const { inAppDays, handleDayChange } = useInAppDays(remainingDays);
  const { selectedOptions, handleInstagramOption, handleToggle } = useSelectedOptions();
  const { couponCode, couponDiscount, couponApplied, applyCoupon } = useDistinctionCoupon(user?._id);
  const { basePrice, discount, totalPrice } = usePriceCalculation(selectedOptions, inAppDays, couponDiscount);
  const { summaryRows, hasSelection } = useOrderSummary(selectedOptions, inAppDays);
  const { nextPushSlot, nextWhatsAppSlot } = useSlotCalculation();
  const { submitPayment, isLoading } = usePaymentProcess(post, user, selectedOptions, inAppDays, totalPrice, tag, couponCode);

  const handleSubmitPayment = () => {
    if (!tag) {
      setTagErr(true);
      toast.error("قم بإختيار وصف لإعلانك");
      return;
    }
    if (inAppDays > remainingDays) {
      toast.error("عدد الأيام المختارة أكثر من المتاح");
      return;
    }
    submitPayment();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="rtl">
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-8">
            {/* Header */}
            <header className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                <HiOutlineSparkles />
                <span>خدمات الترويج الاحترافية</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                اجذب المزيد من المشترين
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
                اختر الأدوات المناسبة لزيادة مشاهدات إعلانك والوصول للعملاء المستهدفين بسرعة.
              </p>
            </header>

            {/* Active Features Alert */}
            {(new Date(post.spotOne) > new Date() || new Date(post.special) > new Date()) && (
              <div className="flex items-center gap-3 bg-blue-50 text-blue-700 p-4 rounded-2xl border border-blue-100">
                <HiOutlineCheckCircle className="text-2xl flex-shrink-0" />
                <p className="font-bold text-sm">إعلانك يتمتع حالياً بميزات ترويجية نشطة.</p>
              </div>
            )}

            {/* Listing Preview */}
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
              <ListingPreview post={post} />
            </div>

            {/* Boost Options */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100 overflow-hidden">
                <InAppBoost inAppDays={inAppDays} onDayChange={handleDayChange} />
              </div>

              <PushNotificationOption
                active={selectedOptions.pushNotification}
                onToggle={() => handleToggle("pushNotification")}
                isUrgent={selectedOptions.urgentPush}
                onUrgentToggle={() => handleToggle("urgentPush")}
                nextSlot={nextPushSlot}
              />

              <InstagramOption
                selected={selectedOptions.instagram}
                onSelect={handleInstagramOption}
              />

              <WhatsAppOption
                active={selectedOptions.whatsapp}
                onToggle={() => handleToggle("whatsapp")}
                nextSlot={nextWhatsAppSlot}
              />
            </div>

            {/* Description Section */}
            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-gray-800">
                <RiAdvertisementLine className="text-xl text-orange-500" />
                <h3 className="font-black text-lg">وصف التميز</h3>
              </div>
              <TagInput
                value={tag}
                onChange={(e) => {
                  setTag(e.target.value);
                  setTagErr(false);
                }}
                hasError={tagErr}
              />
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 relative">
            <div className="lg:sticky lg:top-28">
              <OrderSummary
                summaryRows={summaryRows}
                couponApplied={couponApplied}
                couponDiscount={couponDiscount}
                couponRef={couponRef}
                discount={discount}
                totalPrice={totalPrice}
                hasSelection={hasSelection}
                isLoading={isLoading}
                onApplyCoupon={applyCoupon}
                onPay={handleSubmitPayment}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDistinction;