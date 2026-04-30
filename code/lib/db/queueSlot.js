import { ObjectId } from "mongodb";

const COL = "queue_slots";

// ─── Find next available slot (أقرب slot فاضي) ───────────────────────────────
export async function findNextAvailableSlot(db) {
  return db.collection(COL).findOne(
    { $expr: { $lt: ["$bookedCount", "$capacity"] } },
    { sort: { date: 1, time: 1 } }
  );
}

// ─── Find slot that contains a specific item ──────────────────────────────────
export async function findSlotByItemId(db, itemId) {
  return db.collection(COL).findOne({ items: new ObjectId(itemId) });
}

// ─── Assign item to slot (atomic) ────────────────────────────────────────────
// يرجع الـ slot المحدّث أو null لو مفيش slots
export async function assignItemToSlot(db, itemId, slotId) {
  return db.collection(COL).findOneAndUpdate(
    {
      _id: new ObjectId(slotId),
      $expr: { $lt: ["$bookedCount", "$capacity"] }, // تأكد إنه لسه فاضي (race condition guard)
      items: { $ne: new ObjectId(itemId) },           // منع duplicate
    },
    {
      $push: { items: new ObjectId(itemId) },
      $inc: { bookedCount: 1 },
    },
    { returnDocument: "after" }
  );
}

// ─── Remove item from its slot ────────────────────────────────────────────────
export async function removeItemFromSlot(db, itemId) {
  return db.collection(COL).findOneAndUpdate(
    { items: new ObjectId(itemId) },
    {
      $pull: { items: new ObjectId(itemId) },
      $inc: { bookedCount: -1 },
    },
    { returnDocument: "after" }
  );
}

// ─── Get all slots (for calendar view) ───────────────────────────────────────
export async function findAllSlots(db, fromDate, toDate) {
  const filter = {};
  if (fromDate) filter.date = { $gte: fromDate };
  if (toDate) filter.date = { ...filter.date, $lte: toDate };

  return db
    .collection(COL)
    .find(filter)
    .sort({ date: 1, time: 1 })
    .toArray();
}

// ─── Seed slots for N days ahead ─────────────────────────────────────────────
// بيعمل slots لو مش موجودة (upsert)
export async function seedSlots(db, { daysAhead = 7, times, capacity = 5 } = {}) {
  const DEFAULT_TIMES = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];
  const slotTimes = times ?? DEFAULT_TIMES;

  const ops = [];
  for (let d = 0; d < daysAhead; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split("T")[0]; // "2026-04-27"

    for (const time of slotTimes) {
      ops.push({
        updateOne: {
          filter: { date: dateStr, time },
          update: {
            $setOnInsert: { date: dateStr, time, capacity, bookedCount: 0, items: [] },
          },
          upsert: true,
        },
      });
    }
  }

  if (ops.length === 0) return { upsertedCount: 0 };
  return db.collection(COL).bulkWrite(ops, { ordered: false });
}

// ─── Get slot stats ───────────────────────────────────────────────────────────
export async function getSlotStats(db) {
  return db
    .collection(COL)
    .aggregate([
      {
        $group: {
          _id: null,
          totalSlots: { $sum: 1 },
          totalCapacity: { $sum: "$capacity" },
          totalBooked: { $sum: "$bookedCount" },
          fullSlots: {
            $sum: { $cond: [{ $gte: ["$bookedCount", "$capacity"] }, 1, 0] },
          },
          availableSlots: {
            $sum: { $cond: [{ $lt: ["$bookedCount", "$capacity"] }, 1, 0] },
          },
        },
      },
      {
        $addFields: {
          utilizationRate: {
            $cond: [
              { $gt: ["$totalCapacity", 0] },
              { $round: [{ $multiply: [{ $divide: ["$totalBooked", "$totalCapacity"] }, 100] }, 0] },
              0,
            ],
          },
        },
      },
    ])
    .toArray()
    .then((r) => r[0] ?? { totalSlots: 0, totalCapacity: 0, totalBooked: 0, fullSlots: 0, availableSlots: 0, utilizationRate: 0 });
}

// ─── Calendar: slots grouped by date with populated items ─────────────────────
export async function findCalendarData(db, fromDate, toDate) {
  const filter = {};
  if (fromDate) filter.date = { $gte: fromDate };
  if (toDate) filter.date = { ...filter.date, $lte: toDate };

  const slots = await db
    .collection(COL)
    .aggregate([
      { $match: filter },
      { $sort: { date: 1, time: 1 } },
      // جيب بيانات الـ boost_items
      {
        $lookup: {
          from: "boost_items",
          localField: "items",
          foreignField: "_id",
          as: "itemsData",
        },
      },
      // جيب بيانات الـ listing لكل item
      {
        $lookup: {
          from: "posts",
          localField: "itemsData.listingId",
          foreignField: "_id",
          as: "listings",
        },
      },
      // جيب بيانات الـ advertiser لكل item
      {
        $lookup: {
          from: "users",
          localField: "itemsData.advertiserId",
          foreignField: "_id",
          as: "advertisers",
        },
      },
      {
        $project: {
          date: 1,
          time: 1,
          capacity: 1,
          bookedCount: 1,
          itemsData: {
            $map: {
              input: "$itemsData",
              as: "item",
              in: {
                _id: "$$item._id",
                orderId: "$$item.orderId",
                boostType: "$$item.boostType",
                status: "$$item.status",
                isUrgent: "$$item.isUrgent",
                listing: {
                  $let: {
                    vars: {
                      match: {
                        $arrayElemAt: [
                          { $filter: { input: "$listings", as: "l", cond: { $eq: ["$$l._id", "$$item.listingId"] } } },
                          0,
                        ],
                      },
                    },
                    in: { title: "$$match.title", code: "$$match.code" },
                  },
                },
                advertiser: {
                  $let: {
                    vars: {
                      match: {
                        $arrayElemAt: [
                          { $filter: { input: "$advertisers", as: "u", cond: { $eq: ["$$u._id", "$$item.advertiserId"] } } },
                          0,
                        ],
                      },
                    },
                    in: { username: "$$match.username" },
                  },
                },
              },
            },
          },
        },
      },
    ])
    .toArray();

  // group by date
  const grouped = {};
  for (const slot of slots) {
    if (!grouped[slot.date]) grouped[slot.date] = { date: slot.date, slots: [] };
    grouped[slot.date].slots.push(slot);
  }
  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
}

// ─── Create single slot ───────────────────────────────────────────────────────
export async function createSlot(db, { date, time, capacity = 5 }) {
  // unique index يمنع duplicate تلقائياً
  try {
    const result = await db.collection(COL).insertOne({
      date, time, capacity, bookedCount: 0, items: [],
    });
    return db.collection(COL).findOne({ _id: result.insertedId });
  } catch (err) {
    if (err.code === 11000) {
      const e = new Error(`Slot ${date} ${time} موجود بالفعل`);
      e.status = 409;
      throw e;
    }
    throw err;
  }
}

// ─── Update slot capacity ─────────────────────────────────────────────────────
export async function updateSlotCapacity(db, id, capacity) {
  const slot = await db.collection(COL).findOne({ _id: new ObjectId(id) });
  if (!slot) {
    const e = new Error("Slot غير موجود"); e.status = 404; throw e;
  }
  if (capacity < slot.bookedCount) {
    const e = new Error(`لا يمكن تقليل الـ capacity إلى ${capacity} لأن ${slot.bookedCount} مواعيد محجوزة`);
    e.status = 422; throw e;
  }
  return db.collection(COL).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { capacity } },
    { returnDocument: "after" }
  );
}

// ─── Delete slot (Option A: منع لو فيه items) ────────────────────────────────
export async function deleteSlot(db, id) {
  const slot = await db.collection(COL).findOne({ _id: new ObjectId(id) });
  if (!slot) {
    const e = new Error("Slot غير موجود"); e.status = 404; throw e;
  }
  if (slot.bookedCount > 0) {
    const e = new Error(`لا يمكن حذف slot يحتوي على ${slot.bookedCount} طلبات محجوزة`);
    e.status = 422; throw e;
  }
  await db.collection(COL).deleteOne({ _id: new ObjectId(id) });
  return { deleted: true };
}
