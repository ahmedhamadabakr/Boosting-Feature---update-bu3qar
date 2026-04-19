import { useMemo } from "react";
import { DEFAULT_SETTINGS } from "@/components/Admin/BoostSettings/constants";
import { INSTA_PRICES, INSTA_LABELS } from "@/components/marketing/Post/PostDistinction/constants";

/**
 * Hook لحساب السعر الأساسي والخصم والسعر النهائي
 */
export default function usePriceCalculation(selectedOptions, inAppDays, couponDiscount) {
  return useMemo(() => {
    let basePrice = 0;

    // حساب السعر الأساسي
    if (selectedOptions.inApp) {
      basePrice += Math.ceil(inAppDays / DEFAULT_SETTINGS.inApp.baseDays) * DEFAULT_SETTINGS.inApp.basePrice;
    }

    if (selectedOptions.pushNotification) {
      basePrice += DEFAULT_SETTINGS.push.price;
    }

    if (selectedOptions.urgentPush) {
      basePrice += DEFAULT_SETTINGS.push.urgentPrice;
    }

    selectedOptions.instagram.forEach((opt) => {
      basePrice += INSTA_PRICES[opt];
    });

    if (selectedOptions.whatsapp) {
      basePrice += DEFAULT_SETTINGS.whatsapp.price;
    }

    // حساب الخصم
    let discountPercentage = couponDiscount;
    if (couponDiscount > 0 && couponDiscount < 1) {
      discountPercentage = couponDiscount * 100;
    } else if (couponDiscount >= 1) {
      discountPercentage = couponDiscount;
    }
    
    const discount = couponDiscount > 0 
      ? Math.round((basePrice * discountPercentage) / 100 * 100) / 100 
      : 0;
    const totalPrice = Math.round((basePrice - discount) * 100) / 100;

    return { basePrice, discount, totalPrice };
  }, [selectedOptions, inAppDays, couponDiscount]);
}
