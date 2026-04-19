import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS } from "@/components/Admin/BoostSettings/constants";
import { getNextSlot, getNextWhatsAppSlot } from "@/utils/slotUtils";

/**
 * Hook لحساب أقرب أوقات الإرسال (Push و WhatsApp)
 */
export default function useSlotCalculation() {
  const [nextPushSlot, setNextPushSlot] = useState(null);
  const [nextWhatsAppSlot, setNextWhatsAppSlot] = useState(null);

  // حساب أقرب وقت للتنبيهات العادية
  useEffect(() => {
    const times = DEFAULT_SETTINGS.push.times;
    setNextPushSlot(getNextSlot(times));
  }, []);

  // حساب أقرب وقت واتساب
  useEffect(() => {
    const times = DEFAULT_SETTINGS.whatsapp.times;
    const workingDays = DEFAULT_SETTINGS.whatsapp.workingDays;
    setNextWhatsAppSlot(getNextWhatsAppSlot(times, workingDays));
  }, []);

  return { nextPushSlot, nextWhatsAppSlot };
}
