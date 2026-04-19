import InAppBoost from "../PostDistinction/InAppBoost";
import PushNotificationOption from "../PostDistinction/PushNotificationOption";
import InstagramOption from "../PostDistinction/InstagramOption";
import WhatsAppOption from "../PostDistinction/WhatsAppOption";

const BoostOptions = ({
  selectedOptions,
  inAppDays,
  onDayChange,
  onToggle,
  onInstagramSelect,
  nextPushSlot,
  nextWhatsAppSlot,
}) => {
  return (
    <>
      <InAppBoost inAppDays={inAppDays} onDayChange={onDayChange} />

      <PushNotificationOption
        active={selectedOptions.pushNotification}
        onToggle={() => onToggle("pushNotification")}
        isUrgent={selectedOptions.urgentPush}
        onUrgentToggle={() => onToggle("urgentPush")}
        nextSlot={nextPushSlot}
      />

      <InstagramOption
        selected={selectedOptions.instagram}
        onSelect={onInstagramSelect}
      />

      <WhatsAppOption
        active={selectedOptions.whatsapp}
        onToggle={() => onToggle("whatsapp")}
        nextSlot={nextWhatsAppSlot}
      />
    </>
  );
};

export default BoostOptions;