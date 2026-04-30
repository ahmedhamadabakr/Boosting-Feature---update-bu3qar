import { ObjectId } from "mongodb";
import { isTransitionAllowed } from "@/lib/boostTransitions";

// ─── Processing Method (auto-derived from boostType) ─────────────────────────
export function getProcessingMethod(boostType) {
  const map = {
    in_app: "automatic",
    push: "automatic",
    instagram: "manual",
    whatsapp: "semi-manual",
  };
  return map[boostType] ?? "manual";
}

// ─── Priority Logic ───────────────────────────────────────────────────────────
export function getBoostPriority({ isUrgent, status }) {
  if (isUrgent) return 100;
  if (status === "failed") return 80;
  if (status === "scheduled") return 60;
  return 10;
}

// ─── Insert ───────────────────────────────────────────────────────────────────
export async function insertBoostItem(db, data) {
  const priority = getBoostPriority({
    isUrgent: data.isUrgent ?? false,
    status: data.status ?? "pending",
  });

  const doc = {
    orderId: data.orderId,
    listingId: new ObjectId(data.listingId),
    advertiserId: new ObjectId(data.advertiserId),
    boostType: data.boostType,
    subType: data.subType ?? null,
    status: data.status ?? "pending",
    price: data.price ?? null,
    purchaseDate: data.purchaseDate ?? new Date(),
    scheduledAt: data.scheduledAt ?? null,
    startDate: data.startDate ?? null,
    endDate: data.endDate ?? null,
    processingMethod: data.processingMethod ?? getProcessingMethod(data.boostType),
    isUrgent: data.isUrgent ?? false,
    priority,
    notes: data.notes ?? [],
    logs: data.logs ?? [],
  };

  const result = await db.collection("boost_items").insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

// ─── Find by ID ───────────────────────────────────────────────────────────────
export async function findBoostItemById(db, id) {
  return db
    .collection("boost_items")
    .findOne({ _id: new ObjectId(id) });
}

// ─── Find by advertiser ───────────────────────────────────────────────────────
export async function findBoostItemsByAdvertiserId(db, advertiserId) {
  return db
    .collection("boost_items")
    .find({ advertiserId: new ObjectId(advertiserId) })
    .sort({ priority: -1, purchaseDate: -1 })
    .toArray();
}

// ─── Admin: list all with filters ────────────────────────────────────────────
export async function findBoostItemsAdmin(db, {
  status, boostType, isUrgent, search,
  dateFrom, dateTo, listingId, advertiserId,
} = {}) {
  const filter = {};

  if (status) {
    filter.status = Array.isArray(status) ? { $in: status } : status;
  }
  if (boostType) filter.boostType = boostType;
  if (isUrgent === true) filter.isUrgent = true;
  if (search) filter.orderId = { $regex: search, $options: "i" };
  if (listingId) filter.listingId = new ObjectId(listingId);
  if (advertiserId) filter.advertiserId = new ObjectId(advertiserId);

  if (dateFrom || dateTo) {
    filter.purchaseDate = {};
    if (dateFrom) filter.purchaseDate.$gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      filter.purchaseDate.$lte = end;
    }
  }

  return db
    .collection("boost_items")
    .aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "posts",
          localField: "listingId",
          foreignField: "_id",
          as: "listing",
        },
      },
      { $unwind: { path: "$listing", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "advertiserId",
          foreignField: "_id",
          as: "advertiser",
        },
      },
      { $unwind: { path: "$advertiser", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          orderId: 1,
          boostType: 1,
          subType: 1,
          status: 1,
          price: 1,
          purchaseDate: 1,
          scheduledAt: 1,
          startDate: 1,
          endDate: 1,
          isUrgent: 1,
          priority: 1,
          processingMethod: 1,
          logs: 1,
          notes: 1,
          "listing.title": 1,
          "listing.code": 1,
          "listing.images": 1,
          "listing.region": 1,
          "listing.price": 1,
          "listing._id": 1,
          "advertiser.username": 1,
          "advertiser.phone": 1,
          "advertiser._id": 1,
        },
      },
      { $sort: { priority: -1, purchaseDate: -1 } },
    ])
    .toArray();
}

// ─── Admin Stats (for summary cards) ─────────────────────────────────────────
export async function getBoostItemsStats(db) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await db
    .collection("boost_items")
    .aggregate([
      {
        $facet: {
          totalToday: [
            { $match: { purchaseDate: { $gte: today } } },
            { $count: "count" },
          ],
          pending: [
            { $match: { status: "pending" } },
            { $count: "count" },
          ],
          scheduled: [
            { $match: { status: "scheduled" } },
            { $count: "count" },
          ],
          processing: [
            { $match: { status: "processing" } },
            { $count: "count" },
          ],
          completed: [
            { $match: { status: "completed" } },
            { $count: "count" },
          ],
          failed: [
            { $match: { status: { $in: ["failed", "cancelled"] } } },
            { $count: "count" },
          ],
          urgentPending: [
            { $match: { isUrgent: true, status: "pending" } },
            { $count: "count" },
          ],
        },
      },
    ])
    .toArray();

  const raw = result[0] ?? {};
  // $facet يرجع array لكل facet — نحوّلها لأرقام
  const pick = (key) => raw[key]?.[0]?.count ?? 0;

  return {
    totalToday: pick("totalToday"),
    pending: pick("pending"),
    scheduled: pick("scheduled"),
    processing: pick("processing"),
    completed: pick("completed"),
    failed: pick("failed"),
    urgentPending: pick("urgentPending"),
  };
}
export async function changeBoostItemStatus(db, id, newStatus, adminId, reason) {
  const item = await db
    .collection("boost_items")
    .findOne({ _id: new ObjectId(id) }, { projection: { status: 1, isUrgent: 1 } });

  if (!item) {
    const err = new Error("الطلب غير موجود");
    err.status = 404;
    throw err;
  }

  if (!isTransitionAllowed(item.status, newStatus)) {
    const err = new Error(`لا يمكن الانتقال من "${item.status}" إلى "${newStatus}"`);
    err.status = 422;
    err.currentStatus = item.status;
    throw err;
  }

  const priority = getBoostPriority({ isUrgent: item.isUrgent, status: newStatus });

  return db.collection("boost_items").findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: { status: newStatus, priority },
      $push: {
        logs: {
          action: `status_changed_to_${newStatus}`,
          adminId: adminId ? new ObjectId(adminId) : null,
          reason: reason ?? null,
          createdAt: new Date(),
        },
      },
    },
    { returnDocument: "after" }
  );
}
