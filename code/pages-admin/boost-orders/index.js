import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/Layout";
import { AdminDashboard } from "@/components/Shared/Breadcrumbs";
import BoostOrdersTable from "@/components/Admin/BoostOrders/BoostOrdersTable";
import BoostSummaryCards from "@/components/Admin/BoostOrders/BoostSummaryCards";
import QueueCalendar from "@/components/Admin/BoostOrders/QueueCalendar";
import QueueStats from "@/components/Admin/BoostOrders/QueueStats";
import SlotControls, { EditCapacityModal } from "@/components/Admin/BoostOrders/SlotControls";
import useBoostItems from "@/utils/hooks/useBoostItems";
import { STATUS_LABELS, TYPE_LABELS } from "@/components/Admin/BoostOrders/BoostStatusPill";
import { fetcher } from "@/lib/fetch";
import toast from "react-hot-toast";


const CONFIG = {
  isWhatsAppEnabled: false, 
  urgentAlertThreshold: 0,
};

const STATUS_TABS = [
  { id: "all", label: "الكل", filters: {} },
  { id: "pending", label: "انتظار", filters: { status: "pending" } },
  { id: "scheduled", label: "مجدول", filters: { status: "scheduled" } },
  { id: "processing", label: "تنفيذ", filters: { status: "processing" } },
  { id: "completed", label: "مكتمل", filters: { status: "completed" } },
  { id: "failed", label: " فشل/ملغي", filters: { status: "failed,cancelled" } },
  { id: "urgent", label: " عاجل", filters: { urgent: "true" } },
];

const VIEW_TABS = [
  { id: "table", label: "الطلبات" },
  { id: "calendar", label: "التقويم" },
];

function useBoostStats(refreshKey) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetcher("/api/admin/boost-items/stats");
      setStats(res?.stats ?? null);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [refreshKey]); 

  useEffect(() => { load(); }, [load]);
  return { stats, loading, refetch: load };
}

function useCalendar() {
  const [days, setDays] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetcher("/api/admin/queue/calendar");
      setDays(res?.days ?? []);
      setStats(res?.stats ?? null);
    } catch { toast.error("تعذّر تحميل التقويم"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { days, stats, loading, refetch: load };
}

export default function BoostOrdersPage() {
  const [viewTab, setViewTab] = useState("table");
  const [statusTab, setStatusTab] = useState("all");
  const [statsKey, setStatsKey] = useState(0); // bump to refresh stats

  const [extraFilters, setExtraFilters] = useState({ search: "", boostType: "", dateFrom: "", dateTo: "", listingId: "", advertiserId: "" });
  const [appliedExtra, setAppliedExtra] = useState({ search: "", boostType: "", dateFrom: "", dateTo: "", listingId: "", advertiserId: "" });
  const EMPTY_EXTRA = { search: "", boostType: "", dateFrom: "", dateTo: "", listingId: "", advertiserId: "" };

  const filteredTypeLabels = { ...TYPE_LABELS };
  if (!CONFIG.isWhatsAppEnabled) {
    delete filteredTypeLabels.whatsapp;
  }

  const activeTabFilters = STATUS_TABS.find((t) => t.id === statusTab)?.filters ?? {};
  const mergedFilters = { ...activeTabFilters, ...appliedExtra };

  const { data, loading: tableLoading, error: tableError, refetch: refetchTable } = useBoostItems(mergedFilters);

  // refresh stats whenever table data changes
  const handleStatusChange = useCallback(() => {
    refetchTable();
    setStatsKey((k) => k + 1);
  }, [refetchTable]);

  const { stats: summaryStats, loading: statsLoading } = useBoostStats(statsKey);

  // Show alert if urgentPending exceeds threshold
  useEffect(() => {
    if (summaryStats?.urgentPending > CONFIG.urgentAlertThreshold) {
      toast(`يوجد ${summaryStats.urgentPending} طلبات عاجلة بانتظار التنفيذ!`, { duration: 4000 });
    }
  }, [summaryStats?.urgentPending]);

  // ── Calendar ──
  const { days, stats: calStats, loading: calLoading, refetch: refetchCal } = useCalendar();
  const [editSlot, setEditSlot] = useState(null);

  const handleDeleteSlot = async (slot) => {
    if (!window.confirm(`حذف slot ${slot.date} ${slot.time}؟`)) return;
    try {
      await fetcher(`/api/admin/queue/slots/${slot._id}`, { method: "DELETE" });
      toast.success("تم حذف الـ slot");
      refetchCal();
    } catch (err) { toast.error(err?.message || "حدث خطأ"); }
  };

  // ── card click → switch status tab ──
  const CARD_TO_TAB = {
    totalToday: "all",
    pending: "pending",
    scheduled: "scheduled",
    processing: "processing",
    completed: "completed",
    failed: "failed",
    urgentPending: "urgent",
  };
  const handleCardClick = (cardKey) => {
    const tab = CARD_TO_TAB[cardKey];
    if (tab) setStatusTab(tab);
  };

  return (
    <>
      <AdminDashboard activePage="طلبات البوست" />

      <div className="container mx-auto p-6 space-y-5" dir="rtl">

        <BoostSummaryCards
          stats={summaryStats}
          loading={statsLoading}
          onCardClick={handleCardClick}
          activeFilter={statusTab === "all" ? null : Object.keys(CARD_TO_TAB).find((k) => CARD_TO_TAB[k] === statusTab)}
        />

        <div className="flex gap-2 border-b border-gray-200">
          {VIEW_TABS.map((tab) => (
            <button key={tab.id} onClick={() => setViewTab(tab.id)}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition border-b-2 -mb-px ${viewTab === tab.id
                  ? "border-orange-500 text-orange-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {viewTab === "table" && (
          <>
            <div className="flex flex-wrap gap-1">
              {STATUS_TABS.map((tab) => (
                <button key={tab.id} onClick={() => setStatusTab(tab.id)}
                  className={`px-3 py-1.5 text-xs rounded-full font-medium transition ${statusTab === tab.id
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                  {tab.label}               </button>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex flex-wrap gap-3 items-end">

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">نوع البوست</label>
                  <select value={extraFilters.boostType}
                    onChange={(e) => setExtraFilters((p) => ({ ...p, boostType: e.target.value }))}
                    className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-orange-300">
                    <option value="">الكل</option>
                    {Object.entries(filteredTypeLabels).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">من تاريخ</label>
                  <input type="date" value={extraFilters.dateFrom}
                    onChange={(e) => setExtraFilters((p) => ({ ...p, dateFrom: e.target.value }))}
                    className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-orange-300" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">إلى تاريخ</label>
                  <input type="date" value={extraFilters.dateTo}
                    onChange={(e) => setExtraFilters((p) => ({ ...p, dateTo: e.target.value }))}
                    className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-orange-300" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">كود الإعلان</label>
                  <input type="text" value={extraFilters.listingId}
                    onChange={(e) => setExtraFilters((p) => ({ ...p, listingId: e.target.value }))}
                    placeholder="Listing ID"
                    className="border border-gray-200 rounded-lg text-sm py-2 px-3 w-32 focus:outline-none focus:ring-1 focus:ring-orange-300" />
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
                  <label className="text-xs text-gray-500">بحث (رقم الطلب)</label>
                  <input type="text" value={extraFilters.search}
                    onChange={(e) => setExtraFilters((p) => ({ ...p, search: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && setAppliedExtra({ ...extraFilters })}
                    placeholder="ابحث..."
                    className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-orange-300" />
                </div>

                <button onClick={() => setAppliedExtra({ ...extraFilters })}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2 rounded-lg transition">
                  تطبيق
                </button>
                <button onClick={() => { setExtraFilters(EMPTY_EXTRA); setAppliedExtra(EMPTY_EXTRA); }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg transition">
                  مسح
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              {tableLoading ? <span>جاري التحميل...</span>
                : tableError ? <span className="text-red-500">{tableError}</span>
                  : <>
                    <span>النتائج: <strong className="text-gray-800">{data.length}</strong></span>
                    <button onClick={handleStatusChange} className="text-orange-500 hover:underline text-xs">تحديث</button>
                  </>
              }
            </div>

            {!tableLoading && !tableError && (
              <div className="bg-white rounded-xl shadow overflow-x-auto">
                <BoostOrdersTable data={data} onStatusChange={handleStatusChange} />
              </div>
            )}
          </>
        )}

        {viewTab === "calendar" && (
          <>
            <QueueStats stats={calStats} />
            <SlotControls onRefresh={refetchCal} />

            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">تقويم الـ Queue</h2>
                <button onClick={refetchCal} className="text-xs text-orange-500 hover:underline">
                  {calLoading ? "جاري التحميل..." : "تحديث"}
                </button>
              </div>
              {calLoading
                ? <div className="text-center py-12 text-gray-400">جاري التحميل...</div>
                : <QueueCalendar days={days} onEditCapacity={setEditSlot} onDeleteSlot={handleDeleteSlot} />
              }
            </div>
          </>
        )}
      </div>

      {editSlot && (
        <EditCapacityModal slot={editSlot} onClose={() => setEditSlot(null)} onSaved={refetchCal} />
      )}
    </>
  );
}

BoostOrdersPage.Layout = AdminLayout;
