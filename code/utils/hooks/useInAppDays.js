import { useState, useCallback } from "react";
import toast from "react-hot-toast";

/**
 * Hook لإدارة عدد أيام التمييز والتحقق من الحدود
 */
export default function useInAppDays(remainingDays) {
  const [inAppDays, setInAppDays] = useState(3);

  const handleDayChange = useCallback(
    (increment) => {
      setInAppDays((prev) => {
        let next = increment ? prev + 3 : Math.max(3, prev - 3);
        if (next > remainingDays) {
          toast.error(
            `لا يمكنك اختيار مدة تمييز أكبر من المدة المتبقية (${remainingDays} يوم)`
          );
          return prev;
        }
        return next;
      });
    },
    [remainingDays]
  );

  return { inAppDays, setInAppDays, handleDayChange };
}
