import nc from "next-connect";
import { ncOpts } from "@/lib/nc";
import { auths } from "@/lib/middlewares";
import { getMongoDb } from "@/lib/mongodb";
import { findAllSlots, seedSlots, createSlot, getSlotStats } from "@/lib/db/queueSlot";

const handler = nc(ncOpts);
handler.use(...auths);

handler.get(async (req, res) => {
  if (!req.user || req.user.type !== "مدير عام") {
    return res.status(403).json({ error: { message: "ليس لديك صلاحية" } });
  }

  const db = await getMongoDb();
  const [slots, stats] = await Promise.all([
    findAllSlots(db, req.query.from, req.query.to),
    getSlotStats(db),
  ]);

  res.json({ success: true, slots, stats });
});

// POST /api/admin/queue/slots — seed OR create single slot
handler.post(async (req, res) => {
  if (!req.user || req.user.type !== "مدير عام") {
    return res.status(403).json({ error: { message: "ليس لديك صلاحية" } });
  }

  const db = await getMongoDb();

  // لو في date + time → create single slot
  if (req.body.date && req.body.time) {
    try {
      const slot = await createSlot(db, {
        date:     req.body.date,
        time:     req.body.time,
        capacity: req.body.capacity ?? 5,
      });
      return res.json({ success: true, slot });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: { message: err.message } });
    }
  }

  const result = await seedSlots(db, {
    daysAhead: req.body.daysAhead ?? 7,
    capacity:  req.body.capacity  ?? 5,
    times:     req.body.times     ?? undefined,
  });

  res.json({ success: true, upsertedCount: result.upsertedCount ?? 0 });
});

export default handler;
