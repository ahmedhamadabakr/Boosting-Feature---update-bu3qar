import { insertBoostItem, findBoostItemsByAdvertiserId } from "@/lib/db/boostItem";
import { getMongoDb } from "@/lib/mongodb";
import { ncOpts } from "@/lib/nc";
import nc from "next-connect";

const handler = nc(ncOpts);

// POST /api/boost-items → insert new boost item
handler.post(async (req, res) => {
  try {
    const db = await getMongoDb();
    const item = await insertBoostItem(db, req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

handler.get(async (req, res) => {
  try {
    const { advertiserId } = req.query;
    if (!advertiserId) {
      return res.status(400).json({ error: "advertiserId is required" });
    }
    const db = await getMongoDb();
    const items = await findBoostItemsByAdvertiserId(db, advertiserId);
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default handler;
