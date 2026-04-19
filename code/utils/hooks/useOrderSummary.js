import { useMemo } from "react";
import { DEFAULT_SETTINGS } from "@/components/Admin/BoostSettings/constants";
import { INSTA_PRICES, INSTA_LABELS } from "@/components/marketing/Post/PostDistinction/constants";

/**
 * Hook لحساب ملخص الطلب (summaryRows)
 */
export default function useOrderSummary(selectedOptions, inAppDays) {
  return useMemo(() => {
    const summaryRows = [];

    if (selectedOptions.inApp) {
      summaryRows.push({
        label: `تمييز الإعلان (${inAppDays} أيام)`,
        val: Math.ceil(inAppDays / DEFAULT_SETTINGS.inApp.baseDays) * DEFAULT_SETTINGS.inApp.basePrice,
      });
    }

    if (selectedOptions.pushNotification) {
      summaryRows.push({
        label: "تنبيهات مباشرة",
        val: DEFAULT_SETTINGS.push.price,
      });
    }

    if (selectedOptions.urgentPush) {
      summaryRows.push({
        label: "تنبيه فوري عاجل",
        val: DEFAULT_SETTINGS.push.urgentPrice,
      });
    }

    selectedOptions.instagram.forEach((opt) => {
      summaryRows.push({
        label: INSTA_LABELS[opt],
        val: INSTA_PRICES[opt],
      });
    });

    if (selectedOptions.whatsapp) {
      summaryRows.push({
        label: "برودكاست واتساب",
        val: DEFAULT_SETTINGS.whatsapp.price,
      });
    }

    const hasSelection = summaryRows.length > 0;

    return { summaryRows, hasSelection };
  }, [selectedOptions, inAppDays]);
}
