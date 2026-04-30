import nc from "next-connect";
import { ncOpts } from "@/lib/nc";
import { auths } from "@/lib/middlewares";
import { getMongoDb } from "@/lib/mongodb";
import { changeBoostItemStatus } from "@/lib/db/boostItem";
import { removeFromQueue, handleFailedItem } from "@/lib/services/queueEngine";

const handler = nc(ncOpts);
handler.use(...auths);

// PATCH /api/admin/boost-items/[id]/status
handler.patch(async (req, res) => {
  if (!req.user || req.user.type !== "مدير عام") {
    return res.status(403).json({ error: { message: "ليس لديك صلاحية" } });
  }

  const { id } = req.query;
  const { status, reason } = req.body;

  if (!status) {
    return res.status(400).json({ error: { message: "الحالة مطلوبة" } });
  }

  try {
    const db = await getMongoDb();

    // لو cancelled → شيل من الـ queue أولاً
    if (status === "cancelled") {
      await removeFromQueue(db, id);
    }

    // لو failed → queue engine يتولى الأمر (يرجعه pending بأولوية 80)
    if (status === "failed") {
      await handleFailedItem(db, id);
      return res.json({ success: true, message: "تم إرجاع الطلب للـ queue بأولوية أعلى" });
    }

    const updated = await changeBoostItemStatus(db, id, status, req.user._id, reason);
    res.json({ success: true, data: updated });
  } catch (err) {
    const code = err.status || 500;
    res.status(code).json({
      success: false,
      error: { message: err.message, currentStatus: err.currentStatus },
    });
  }
});

export default handler;
