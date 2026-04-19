import { useRef, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { nanoid } from "nanoid";
import { fetcher } from "@/lib/fetch";
import { addDays } from "@/utils/dateFormat";
import useStickyState from "@/utils/hooks/useStickyState";

export default function usePaymentProcess(post, user, selectedOptions, inAppDays, totalPrice, tag, couponCode) {
  const processRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const [plane, setPlane] = useStickyState(
    {
      spotOne: false,
      special: false,
      PostId: post._id,
      postCode: post.code || post._id,
      order_id: nanoid(15),
      numberofdays: inAppDays,
      price: totalPrice,
      coupon: couponCode || "",
      label: tag || "",
    },
    "bo3qar"
  );

  useEffect(() => {
    setPlane((prev) => ({
      ...prev,
      price: totalPrice,
      numberofdays: inAppDays,
      coupon: couponCode || "",
      label: tag || "",
    }));
  }, [totalPrice, inAppDays, couponCode, tag, setPlane]);

  const handlePayment = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!plane.postCode) throw new Error("رمز الإعلان غير موجود");
      if (!plane.price || plane.price <= 0) throw new Error("السعر غير صحيح");

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
            description: `تمييز اعلان كود رقم ${plane.postCode}`,
          },
          language: "ar",
          reference: {
            id: plane.order_id,
          },
          customer: {
            uniqueId: user?._id,
            name: user?.username,
            email: user?.email,
            mobile: user?.phone,
          },
          returnUrl: "https://www.bu3qar.com/payment/distinction/post",
          cancelUrl: "https://www.bu3qar.com/payment/fail",
          notificationUrl: "https://www.bu3qar.com/api/payment",
        }),
      });

      if (!res) throw new Error("لم يتم استلام رد من الخادم");

      let paymentLink =
        res?.result?.data?.payment_url ||
        res?.result?.data?.link ||
        res?.result?.payment_url ||
        res?.result?.link ||
        res?.data?.link ||
        res?.link ||
        (typeof res === "string" ? res : null);

      if (!paymentLink) {
        throw new Error("فشل في الحصول على رابط الدفع");
      }

      document.location.href = paymentLink;
    } catch (e) {
      setIsLoading(false);
      toast.error(e?.message || "حدث خطأ أثناء معالجة الدفع");
    }
  }, [user, plane]);

  useEffect(() => {
    if (processRef.current) {
      handlePayment();
      processRef.current = false;
    }
  }, [plane, handlePayment]);

  const submitPayment = useCallback(() => {
    if (!tag) {
      toast.error("قم بإختيار وصف لإعلانك");
      return;
    }
    if (inAppDays > 999) {
      toast.error("المدة المختارة غير صحيحة");
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
  }, [tag, inAppDays, selectedOptions, post, totalPrice, couponCode, user]);

  return { plane, submitPayment, isLoading };
}