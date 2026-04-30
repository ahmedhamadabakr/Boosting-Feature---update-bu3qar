import nc from "next-connect";
import { ncOpts } from "@/lib/nc";
import { auths } from "@/lib/middlewares";
import { getMongoDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { rescheduleItem } from "@/lib/services/queueEngine";

const handler = nc(ncOpts);
handler.use(...auths);

const TYPE_ACTIONS = {
  instagram: ["prepare", "publish", "attach_link"],
  whatsapp:  ["approve", "send", "reschedule"],
  push:      ["send_urgent"],
  in_app:    [],
};

const ACTION_STATUS = {
  prepare:     null,          
  publish:     "completed",
  attach_link: null,
  approve:     "processing",
  send:        "completed",
  reschedule:  null,          
  send_urgent: "processing",
};

handler.post(async (req, res) => {
  if (!req.user || req.user.type !== "مدير عام") {
    return res.status(403).json({ error: { message: "ليس لديك صلاحية" } });
  }

  const { id } = req.query;
  const { action, reason, note } = req.body;

  if (!action) {
    return res.status(400).json({ error: { message: "action مطلوب" } });
  }

  const db = await getMongoDb();

  const item = await db
    .collection("boost_items")
    .findOne({ _id: new ObjectId(id) }, { projection: { boostType: 1, status: 1 } });

  if (!item) {
    return res.status(404).json({ error: { message: "الطلب غير موجود" } });
  }

  const allowed = TYPE_ACTIONS[item.boostType] ?? [];
  if (action !== "add_note" && !allowed.includes(action)) {
    return res.status(422).json({
      error: { message: `الـ action "${action}" غير مسموح لـ ${item.boostType}` },
    });
  }

  // ── reschedule → queue engine ──
  if (action === "reschedule") {
    try {
      await rescheduleItem(db, id);
      return res.json({ success: true, message: "تم إعادة الجدولة" });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }

  // ── add_note ──
  if (action === "add_note") {
    if (!note) return res.status(400).json({ error: { message: "النص مطلوب" } });
    await db.collection("boost_items").updateOne(
      { _id: new ObjectId(id) },
      { $push: { notes: { text: note, createdAt: new Date(), adminId: new ObjectId(req.user._id) } } }
    );
    return res.json({ success: true, message: "تمت إضافة الملاحظة" });
  }

  // ── build $set ──
  const $set = {};
  const newStatus = ACTION_STATUS[action];
  if (newStatus) $set.status = newStatus;

  // send_urgent → isUrgent = true + priority = 100
  if (action === "send_urgent") {
    $set.isUrgent = true;
    $set.priority = 100;
  }

  const logEntry = {
    action,
    adminId:   new ObjectId(req.user._id),
    reason:    reason ?? null,
    createdAt: new Date(),
  };

  await db.collection("boost_items").updateOne(
    { _id: new ObjectId(id) },
    {
      ...(Object.keys($set).length ? { $set } : {}),
      $push: { logs: logEntry },
    }
  );

  res.json({ success: true, action, newStatus });
});

export default handler;
