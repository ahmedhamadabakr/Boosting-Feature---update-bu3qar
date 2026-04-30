import nc from "next-connect";
import { ncOpts } from "@/lib/nc";
import { auths } from "@/lib/middlewares";
import { getMongoDb } from "@/lib/mongodb";
import { getBoostItemsStats } from "@/lib/db/boostItem";

const handler = nc(ncOpts);
handler.use(...auths);

// GET /api/admin/boost-items/stats
handler.get(async (req, res) => {
  if (!req.user || req.user.type !== "مدير عام") {
    return res.status(403).json({ error: { message: "ليس لديك صلاحية" } });
  }
  const db = await getMongoDb();
  const stats = await getBoostItemsStats(db);
  res.json({ success: true, stats });
});

export default handler;
