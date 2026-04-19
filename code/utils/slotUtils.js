/**
 * دوال مساعدة لحساب ومعالجة أوقات الإرسال والتنبيهات
 */

// تنسيق تاريخ ووقت الفتحة
export function formatSlot(date) {
  return {
    date: date.toLocaleDateString("ar-EG", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
    time: date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

// convert 12-hour time to 24-hour format
export function convertTo24Hour(time12) {
  const [time, period] = time12.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

// find the next available slot for regular notifications
export function getNextSlot(times) {
  if (!times || times.length === 0) return null;

  const now = new Date();

  const todaySlots = times
    .map((t) => {
      const time24 = convertTo24Hour(t);
      const [h, m] = time24.split(":").map(Number);
      const date = new Date();
      date.setHours(h, m, 0, 0);
      return date;
    })
    .sort((a, b) => a - b);

  // search for the next available slot today
  for (let slot of todaySlots) {
    if (slot > now) {
      return formatSlot(slot);
    }
  }

  // if all times for today have passed, use the first time tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const firstTime24 = convertTo24Hour(times[0]);
  const [h, m] = firstTime24.split(":").map(Number);
  tomorrow.setHours(h, m, 0, 0);

  return formatSlot(tomorrow);
}

// find the next available WhatsApp slot (considering working days)
export function getNextWhatsAppSlot(times, workingDays) {
  if (!times || times.length === 0) return null;

  const now = new Date();
  const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  let currentDate = new Date(now);

  // search for the first available working day
  for (let i = 0; i < 7; i++) {
    const currentDay = dayNames[currentDate.getDay()];
    
    if (workingDays[currentDay]) {
      // the day is available for work
      const todaySlots = times
        .map((t) => {
          const time24 = convertTo24Hour(t);
          const [h, m] = time24.split(":").map(Number);
          const date = new Date(currentDate);
          date.setHours(h, m, 0, 0);
          return date;
        })
        .sort((a, b) => a - b);

      // search for the first available slot today
      for (let slot of todaySlots) {
        if (slot > now) {
          return formatSlot(slot);
        }
      }

      // if all times for today have passed, use the first time tomorrow
      const firstTime24 = convertTo24Hour(times[0]);
      const [h, m] = firstTime24.split(":").map(Number);
      currentDate.setHours(h, m, 0, 0);
      return formatSlot(currentDate);
    }

    // move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(0, 0, 0, 0);
  }

  return null;
}
