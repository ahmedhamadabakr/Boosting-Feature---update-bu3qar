import { useState, useMemo } from "react";
import FixedTable from "@/components/Shared/Table/FixedTable";
import { BoostStatusPill, BoostTypePill, BoostMethodPill, BoostSubTypePill } from "./BoostStatusPill";
import BoostActionButtons from "./BoostActionButtons";
import BoostTimeline from "./BoostTimeline";
import BoostDetailModal from "./BoostDetailModal";
import { dateFormat } from "@/utils/dateFormat";

// ── Row detail expand (Timeline) ─────────────────────────────────────────────
function ExpandedRow({ item, onClose }) {
  return (
    <div className="bg-gray-50 border-t border-gray-100 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-600">سجل العمليات</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
      </div>
      <BoostTimeline logs={item.logs ?? []} />
    </div>
  );
}

export default function BoostOrdersTable({ data, onStatusChange }) {
  const [expandedId, setExpandedId] = useState(null);
  const [detailItem, setDetailItem] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "_id",
        width: "3%",
        Cell: ({ row }) => (
          <button
            onClick={() => setExpandedId((prev) => prev === row.original._id ? null : row.original._id)}
            className="text-gray-400 hover:text-orange-500 transition text-xs"
            title="عرض السجل"
          >
            {expandedId === row.original._id ? "▲" : row.index + 1}
          </button>
        ),
      },
      {
        Header: "رقم الطلب",
        accessor: "orderId",
        width: "10%",
        Cell: ({ value, row }) => (
          <div>
            <p className="font-medium text-sm">{value}</p>
            {row.original.isUrgent && (
              <span className="text-xs text-red-600 font-bold">⚡ عاجل</span>
            )}
          </div>
        ),
      },
      {
        Header: "المعلن",
        accessor: "advertiser.username",
        width: "11%",
        Cell: ({ value, row }) => (
          <div>
            <p className="text-sm font-medium">{value || "—"}</p>
            <p className="text-xs text-gray-400">{row.original.advertiser?.phone || ""}</p>
          </div>
        ),
      },
      {
        Header: "الإعلان",
        accessor: "listing.title",
        width: "13%",
        Cell: ({ value, row }) => (
          <div>
            <p className="text-sm">{value || "—"}</p>
            <p className="text-xs text-gray-400">#{row.original.listing?.code || ""}</p>
          </div>
        ),
      },
      {
        Header: "النوع",
        accessor: "boostType",
        width: "8%",
        Cell: ({ value }) => <BoostTypePill value={value} />,
      },
      {
        Header: "الفئة",
        accessor: "subType",
        width: "7%",
        Cell: ({ value }) => <BoostSubTypePill value={value} />,
      },
      {
        Header: "الطريقة",
        accessor: "processingMethod",
        width: "8%",
        Cell: ({ value }) => <BoostMethodPill value={value} />,
      },
      {
        Header: "الحالة",
        accessor: "status",
        width: "9%",
        Cell: ({ value }) => <BoostStatusPill value={value} />,
      },
      {
        Header: "السعر",
        accessor: "price",
        width: "6%",
        Cell: ({ value }) => (value ? `${value} د.ك` : "—"),
      },
      {
        Header: "تاريخ الشراء",
        accessor: "purchaseDate",
        width: "10%",
        Cell: ({ value }) => (value ? dateFormat(value) : "—"),
      },
      {
        Header: "الإجراءات",
        accessor: "actions",
        width: "15%",
        Cell: ({ row }) => (
          <BoostActionButtons
            item={row.original}
            onSuccess={onStatusChange}
            onViewDetails={setDetailItem}
          />
        ),
      },
    ],
    [onStatusChange, expandedId]
  );

  const tableData = useMemo(() => data, [data]);

  return (
    <div>
      <FixedTable columns={columns} data={tableData} />

      {expandedId && (() => {
        const item = data.find((d) => d._id === expandedId);
        return item ? <ExpandedRow item={item} onClose={() => setExpandedId(null)} /> : null;
      })()}

      {detailItem && (
        <BoostDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onStatusChange={() => { onStatusChange?.(); setDetailItem(null); }}
        />
      )}
    </div>
  );
}
