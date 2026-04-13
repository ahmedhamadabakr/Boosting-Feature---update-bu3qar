import React, { useState, useRef, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { nanoid } from "nanoid";
import { fetcher } from "@/lib/fetch";
import { addDays } from "@/utils/dateFormat";
import useStickyState from "@/utils/hooks/useStickyState";

import { HiOutlineSparkles, HiOutlineCheckCircle, } from "react-icons/hi";
import { RiAdvertisementLine } from "react-icons/ri";

import { INSTA_PRICES, INSTA_LABELS } from "./PostDistinction/constants.js";
import ListingPreview from "./PostDistinction/ListingPreview.js";
import InAppBoost from "./PostDistinction/InAppBoost.js";
import PushNotificationOption from "./PostDistinction/PushNotificationOption.js";
import InstagramOption from "./PostDistinction/InstagramOption.js";
import WhatsAppOption from "./PostDistinction/WhatsAppOption.js";
import TagInput from "./PostDistinction/TagInput.js";
import OrderSummary from "./PostDistinction/OrderSummary.js";

const PostDistinction = ({ post, user}) => {
  if (typeof window !== "undefined") {
   
    console.log(" post:", post);
  }
  const couponRef = useRef();
  const processRef = useRef(false);
  const [tag, setTag] = useState("");
  const [tagErr, setTagErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [inAppDays, setInAppDays] = useState(3);
  const [selectedOptions, setSelectedOptions] = useState({
    inApp: true,
    pushNotification: false,
    instagram: [],
    whatsapp: false,
  });

  const calcBasePrice = useCallback(() => {
    let total = 0;
    if (selectedOptions.inApp) total += Math.ceil(inAppDays / 3) * 5;
    if (selectedOptions.pushNotification) total += 3;
    selectedOptions.instagram.forEach((opt) => {
      total += INSTA_PRICES[opt];
    });
    if (selectedOptions.whatsapp) total += 2;
    return total;
  }, [selectedOptions, inAppDays]);

  const basePrice = calcBasePrice();
  const discount = couponDiscount > 0 ? Math.round(basePrice * couponDiscount) / 100 : 0;
  const totalPrice = Math.round((basePrice - discount) * 100) / 100;

  const [plane, setPlane] = useStickyState(
    {
      spotOne: false,
      special: false,
      PostId: post._id,
      postCode: post.code,
      order_id: nanoid(15),
      numberofdays: inAppDays,
      price: 0,
      coupon: "",
      label: "",
    },
    "bo3qar"
  );

  useEffect(() => {
    setPlane((prev) => ({ ...prev, price: totalPrice, numberofdays: inAppDays }));
  }, [totalPrice, inAppDays, setPlane]);
 
  const handleDayChange = (increment) =>
    setInAppDays((prev) => (increment ? prev + 3 : Math.max(3, prev - 3)));

  const handleInstagramOption = (option) =>
    setSelectedOptions((prev) => {
      const isSelected = prev.instagram.includes(option);
      return {
        ...prev,
        instagram: isSelected
          ? prev.instagram.filter((i) => i !== option)
          : [...prev.instagram, option],
      };
    });

  const handleToggle = (option) =>
    setSelectedOptions((prev) => ({ ...prev, [option]: !prev[option] }));


  const handelSetPlane = () => {
    if (!tag) {
      setTagErr(true);
      toast.error("قم بإختيار وصف لإعلانك");
      return;
    }
    setPlane((prev) => ({
      ...prev,
      spotOne: selectedOptions.inApp ? addDays(inAppDays) : post.spotOne || new Date(),
      special: selectedOptions.instagram.length > 0 ? addDays(inAppDays) : post.special || new Date(),
      label: tag,
      numberofdays: inAppDays,
      price: totalPrice,
      coupon: couponCode,
      UserId: user._id,
      ...(user.company_id && { CompanyId: user.company_id }),
    }));
    processRef.current = true;
  };

  const handlePayment = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetcher("/api/payment/execute", {
        method: "POST",
        body: JSON.stringify({
          products: [
            {
              name: `تمييز اعلان كود رقم ${plane.postCode}`,
              price: plane.price,
              description: `تمييز اعلان كود رقم ${plane.postCode} لمدة ${plane.numberofdays} يوم`,
              quantity: 1,
            },
          ],
          order: {
            id: plane.order_id,
            currency: "KWD",
            amount: plane.price,
          },
          customer: {
            uniqueId: user?._id,
            name: user?.username,
            mobile: user?.phone,
          },
          returnUrl: "https://www.bu3qar.com/payment/distinction/post",
          cancelUrl: "https://www.bu3qar.com/payment/fail",
        }),
      });
      document.location.href = res.result.data.link;
    } catch (e) {
      setIsLoading(false);
      toast.error(e.message);
    }
  }, [user, plane]);

  useEffect(() => {
    if (processRef.current) {
      handlePayment();
      processRef.current = false;
    }
  }, [plane, handlePayment]);

  const testIt = async () => {
    const code = couponRef.current?.value?.trim();
    if (!code) return;
    try {
      const res = await fetcher("/api/user/coupon/verify", {
        method: "POST",
        body: JSON.stringify({ coupon: code, type: "postCouponVerify" }),
      });
      setCouponDiscount(Number(res.discount));
      setCouponCode(code);
      setCouponApplied(true);
      toast.success(`تم تطبيق خصم بقيمة ${res.discount}%`);
    } catch (e) {
      toast.error("كوبون غير صالح");
    }
  };

 
  const summaryRows = [];
  if (selectedOptions.inApp)
    summaryRows.push({ label: `تمييز الإعلان (${inAppDays} أيام)`, val: Math.ceil(inAppDays / 3) * 5 });
  if (selectedOptions.pushNotification)
    summaryRows.push({ label: "تنبيهات مباشرة", val: 3 });
  
  selectedOptions.instagram.forEach((opt) => {
    summaryRows.push({ 
      label: INSTA_LABELS[opt], 
      val: INSTA_PRICES[opt] 
    });
  });

  if (selectedOptions.whatsapp)
    summaryRows.push({ label: "برودكاست واتساب", val: 2 });

  const hasSelection = summaryRows.length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="rtl">
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
     
          <div className="lg:col-span-8 space-y-8">
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

          
            {(new Date(post.spotOne) > new Date() || new Date(post.special) > new Date()) && (
              <div className="flex items-center gap-3 bg-blue-50 text-blue-700 p-4 rounded-2xl border border-blue-100">
                <HiOutlineCheckCircle className="text-2xl flex-shrink-0" />
                <p className="font-bold text-sm">إعلانك يتمتع حالياً بميزات ترويجية نشطة.</p>
              </div>
            )}

            <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
                <ListingPreview post={post} />
            </div>

      
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100 overflow-hidden">
                <InAppBoost inAppDays={inAppDays} onDayChange={handleDayChange} />
              </div>
              
              <PushNotificationOption
                active={selectedOptions.pushNotification}
                onToggle={() => handleToggle("pushNotification")}
              />
              
              <InstagramOption
                selected={selectedOptions.instagram}
                onSelect={handleInstagramOption}
              />
              
              <WhatsAppOption
                active={selectedOptions.whatsapp}
                onToggle={() => handleToggle("whatsapp")}
              />
            </div>

            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-gray-800">
                <RiAdvertisementLine className="text-xl text-orange-500" />
                <h3 className="font-black text-lg">وصف التميز</h3>
              </div>
              <TagInput
                value={tag}
                onChange={(e) => { setTag(e.target.value); setTagErr(false); }}
                hasError={tagErr}
              />
            </section>
          </div>

          <div className="lg:col-span-4 relative">
            <div className="lg:sticky lg:top-28">
              <OrderSummary
                summaryRows={summaryRows}
                couponApplied={couponApplied}
                couponDiscount={couponDiscount}
                discount={discount}
                totalPrice={totalPrice}
                hasSelection={hasSelection}
                isLoading={isLoading}
                couponRef={couponRef}
                onApplyCoupon={testIt}
                onPay={handelSetPlane}
              />              
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PostDistinction;