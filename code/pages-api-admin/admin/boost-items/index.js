import nc from "next-connect";
import { ncOpts } from "@/lib/nc";
import { auths } from "@/lib/middlewares";
import { getMongoDb } from "@/lib/mongodb";
import { findBoostItemsAdmin } from "@/lib/db/boostItem";

const handler = nc(ncOpts);
handler.use(...auths);

// GET /api/admin/boost-items
handler.get(async (req, res) => {
  if (!req.user || req.user.type !== "مدير عام") {
    return res.status(403).json({ error: { message: "ليس لديك صلاحية" } });
  }

  const { status, boostType, urgent, search, dateFrom, dateTo, listingId, advertiserId } = req.query;

  const statusVal = status
    ? status.includes(",") ? status.split(",") : status
    : null;

  const db = await getMongoDb();
  const items = await findBoostItemsAdmin(db, {
    status:       statusVal,
    boostType:    boostType    || null,
    isUrgent:     urgent === "true" ? true : null,
    search:       search       || null,
    dateFrom:     dateFrom     || null,
    dateTo:       dateTo       || null,
    listingId:    listingId    || null,
    advertiserId: advertiserId || null,
  });

  res.json({ success: true, data: items });
});

export default handler;
