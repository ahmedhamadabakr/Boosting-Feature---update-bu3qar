import nc from "next-connect";
import { ncOpts } from "@/lib/nc";
import { auths } from "@/lib/middlewares";
import { getMongoDb } from "@/lib/mongodb";
import { rescheduleItem } from "@/lib/services/queueEngine";

const handler = nc(ncOpts);
handler.use(...auths);

// POST /api/admin/boost-items/[id]/reschedule
handler.post(async (req, res) => {
  if (!req.user || req.user.type !== "مدير عام") {
    return res.status(403).json({ error: { message: "ليس لديك صلاحية" } });
  }

  try {
    const db = await getMongoDb();
    const result = await rescheduleItem(db, req.query.id);
    res.json({ success: true, slot: result.slot });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: { message: err.message } });
  }
});

export default handler;
