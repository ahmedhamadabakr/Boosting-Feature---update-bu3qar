import nc from "next-connect";
import { ncOpts } from "@/lib/nc";
import { auths } from "@/lib/middlewares";
import { getMongoDb } from "@/lib/mongodb";
import { updateSlotCapacity, deleteSlot } from "@/lib/db/queueSlot";

const handler = nc(ncOpts);
handler.use(...auths);

const guard = (req, res) => {
  if (!req.user || req.user.type !== "مدير عام") {
    res.status(403).json({ error: { message: "ليس لديك صلاحية" } });
    return false;
  }
  return true;
};

// PATCH /api/admin/queue/slots/[id] — update capacity
handler.patch(async (req, res) => {
  if (!guard(req, res)) return;
  try {
    const db = await getMongoDb();
    const updated = await updateSlotCapacity(db, req.query.id, Number(req.body.capacity));
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: { message: err.message } });
  }
});

// DELETE /api/admin/queue/slots/[id]
handler.delete(async (req, res) => {
  if (!guard(req, res)) return;
  try {
    const db = await getMongoDb();
    await deleteSlot(db, req.query.id);
    res.json({ success: true });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: { message: err.message } });
  }
});

export default handler;
