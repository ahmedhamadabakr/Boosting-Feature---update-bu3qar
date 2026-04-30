import nc from "next-connect";
import { ncOpts } from "@/lib/nc";
import { auths } from "@/lib/middlewares";
import { getMongoDb } from "@/lib/mongodb";
import { processQueue } from "@/lib/services/queueEngine";
import { seedSlots } from "@/lib/db/queueSlot";

const handler = nc(ncOpts);
handler.use(...auths);

// POST /api/admin/queue/process
handler.post(async (req, res) => {
  if (!req.user || req.user.type !== "مدير عام") {
    return res.status(403).json({ error: { message: "ليس لديك صلاحية" } });
  }

  const db = await getMongoDb();

  // seed slots تلقائياً لو مطلوب
  if (req.body?.seedFirst) {
    await seedSlots(db, {
      daysAhead: req.body.daysAhead ?? 7,
      capacity:  req.body.capacity  ?? 5,
    });
  }

  const results = await processQueue(db);
  res.json({ success: true, results });
});

export default handler;
