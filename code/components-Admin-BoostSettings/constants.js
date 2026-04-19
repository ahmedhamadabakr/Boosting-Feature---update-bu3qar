export const DAYS_OF_WEEK = [
  { key: "sun", label: "الأحد",    defaultOn: true  },
  { key: "mon", label: "الاثنين",  defaultOn: true  },
  { key: "tue", label: "الثلاثاء", defaultOn: true  },
  { key: "wed", label: "الأربعاء", defaultOn: true  },
  { key: "thu", label: "الخميس",  defaultOn: true  },
  { key: "fri", label: "الجمعة",  defaultOn: false },
  { key: "sat", label: "السبت",   defaultOn: false },
];

export const DEFAULT_SETTINGS = {
  inApp: {
    enabled:     true,
    title:       "ترويج عقاري مميز",
    description: "احصل على ظهور مضاعف لعقارك في مقدمة نتائج البحث.",
    baseDays:    3,
    basePrice:   5,
  },
  push: {
    enabled:      true,
    price:        3,
    dailySlots:   3,
    times:        ["10:00 AM", "02:00 PM", "08:00 PM"],
    urgentPrice:  8,
    urgentMax:    5,
  },
  instagram: {
    enabled: true,
    story:   { enabled: true,  price: 2 },
    post:    { enabled: true,  price: 5 },
    reel:    { enabled: true,  price: 8 },
  },
  whatsapp: {
    enabled:    true,
    price:      2,
    dailyCap:   5,
    times:      ["10:00 AM", "02:00 PM"],
    workingDays: {
      sun: true, mon: false, tue: true,
      wed: false, thu: true, fri: false, sat: false,
    },
  },
};
