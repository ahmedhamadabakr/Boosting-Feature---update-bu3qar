import { useState, useCallback } from "react";

/**
 * Hook لإدارة حالة الخيارات المختارة (In-App Boost, Push, Instagram, WhatsApp)
 */
export default function useSelectedOptions() {
  const [selectedOptions, setSelectedOptions] = useState({
    inApp: true,
    pushNotification: false,
    instagram: [],
    whatsapp: false,
    urgentPush: false,
  });

  const handleInstagramOption = useCallback((option) => {
    setSelectedOptions((prev) => {
      const isSelected = prev.instagram.includes(option);
      return {
        ...prev,
        instagram: isSelected
          ? prev.instagram.filter((i) => i !== option)
          : [...prev.instagram, option],
      };
    });
  }, []);

  const handleToggle = useCallback((option) => {
    setSelectedOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  }, []);

  const handlePushToggle = useCallback((type) => {
    setSelectedOptions((prev) => {
      if (type === 'normal') {
        return {
          ...prev,
          pushNotification: !prev.pushNotification,
          urgentPush: false, // إلغاء العاجل إذا كان مفعل
        };
      } else if (type === 'urgent') {
        return {
          ...prev,
          pushNotification: false, // إلغاء العادي إذا كان مفعل
          urgentPush: !prev.urgentPush,
        };
      }
      return prev;
    });
  }, []);

  return {
    selectedOptions,
    setSelectedOptions,
    handleInstagramOption,
    handleToggle,
    handlePushToggle,
  };
}
