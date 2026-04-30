import nc from "next-connect";
import { ncOpts } from "@/lib/nc";
import { auths } from "@/lib/middlewares";
import { getMongoDb } from "@/lib/mongodb";
import { findCalendarData, getSlotStats } from "@/lib/db/queueSlot";

const handler = nc(ncOpts);
handler.use(...auths);


handler.get(async (req, res) => {
  if (!req.user || req.user.type !== "مدير عام") {
    return res.status(403).json({ error: { message: "ليس لديك صلاحية" } });
  }

  const today = new Date().toISOString().split("T")[0];
  const weekAhead = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const from = req.query.from ?? today;
  const to   = req.query.to   ?? weekAhead;

  const db = await getMongoDb();
  const [days, stats] = await Promise.all([
    findCalendarData(db, from, to),
    getSlotStats(db),
  ]);

  res.json({ success: true, days, stats });
});

export default handler;
