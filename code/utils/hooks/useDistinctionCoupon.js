import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { fetcher } from "@/lib/fetch";

/**
 * Hook مخصص للتحقق من كوبونات تمييز الإعلان
 * يستخدم endpoint مستقل لا يشترط packageId
 */
export default function useDistinctionCoupon(userId) {
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const applyCoupon = useCallback(
    async (code) => {
      if (!code || code.length < 4) {
        toast.error("أدخل كود صحيح");
        return;
      }

      try {
        const res = await fetch("/api/user/coupon/verify-distinction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coupon: code, userId }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data?.debug) {
            console.warn("🔍 Coupon debug info:", JSON.stringify(data.debug, null, 2));
          }
          toast.error(data?.error?.message || "كوبون غير صالح");
          return;
        }

        if (data?.discount) {
          const discountValue = Number(data.discount);
          setCouponDiscount(discountValue);
          setCouponCode(code);
          setCouponApplied(true);
          toast.success(`تم تطبيق خصم ${discountValue}% بنجاح`);
        } else {
          toast.error("كوبون غير صالح أو منتهي");
        }
      } catch (e) {
        toast.error(e?.message || "كوبون غير صالح");
      }
    },
    [userId]
  );

  const resetCoupon = useCallback(() => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponApplied(false);
  }, []);

  return { couponCode, couponDiscount, couponApplied, applyCoupon, resetCoupon };
}
