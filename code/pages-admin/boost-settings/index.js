import { useState } from "react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/Layout";
import { AdminDashboard } from "@/components/Shared/Breadcrumbs";

import { DEFAULT_SETTINGS } from "@/components/Admin/BoostSettings/constants";
import PageHeader from "@/components/Admin/BoostSettings/PageHeader";
import InAppBoostSection from "@/components/Admin/BoostSettings/InAppBoostSection";
import PushNotificationSection from "@/components/Admin/BoostSettings/PushNotificationSection";
import InstagramSection from "@/components/Admin/BoostSettings/InstagramSection";
import WhatsAppSection from "@/components/Admin/BoostSettings/WhatsAppSection";

const BoostSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const set = (section) => (val) =>
    setSettings((prev) => ({ ...prev, [section]: val }));

  const hasInvalidNumbers = () => {
    const { inApp, push, instagram, whatsapp } = settings;

    if (inApp.baseDays <= 0 || inApp.basePrice <= 0) return true;

    if (
      push.price <= 0 ||
      push.dailySlots <= 0 ||
      push.urgentPrice <= 0 ||
      push.urgentMax <= 0
    )
      return true;

    if (["story", "post", "reel"].some((t) => instagram[t].price <= 0))
      return true;

    if (whatsapp.price <= 0 || whatsapp.dailyCap <= 0) return true;

    return false;
  };

  const handleSave = () => {
    if (hasInvalidNumbers()) {
      toast.error("يجب إدخال أرقام موجبة أكبر من الصفر في جميع الحقول.");
      return;
    }

    // TODO: POST settings to your API
    toast.success("تم حفظ الإعدادات بنجاح");
  };

  const handleCancel = () => {
    setSettings(DEFAULT_SETTINGS);
    toast("تم إلغاء التغييرات");
  };

  return (
    <>
         <AdminDashboard activePage="إعدادات الترقية" />
    <div className="min-h-screen bg-neutral-50" dir="rtl">
      <main className="pt-10 pb-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
        <PageHeader onSave={handleSave} onCancel={handleCancel} />

        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12">
            <InAppBoostSection
              settings={settings.inApp}
              onChange={set("inApp")}
            />
          </div>

          <div className="col-span-12 lg:col-span-7">
            <PushNotificationSection
              settings={settings.push}
              onChange={set("push")}
            />
          </div>

          <div className="col-span-12 lg:col-span-5">
            <InstagramSection
              settings={settings.instagram}
              onChange={set("instagram")}
            />
          </div>

          <div className="col-span-12">
            <WhatsAppSection
              settings={settings.whatsapp}
              onChange={set("whatsapp")}
            />
          </div>
        </div>
      </main>
    </div>
    </>

  );
};

BoostSettings.Layout = AdminLayout;
export default BoostSettings;