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

  return {
    selectedOptions,
    setSelectedOptions,
    handleInstagramOption,
    handleToggle,
  };
}
