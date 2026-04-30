
import { ObjectId } from "mongodb";
import {
  findNextAvailableSlot,
  findSlotByItemId,
  assignItemToSlot,
  removeItemFromSlot,
  seedSlots,
} from "@/lib/db/queueSlot";
import { getBoostPriority } from "@/lib/db/boostItem";

// ─── Assign single item to next available slot ────────────────────────────────
export async function assignToQueue(db, itemId) {
  const itemObjId = new ObjectId(itemId);

  // تأكد إن الـ item مش موجود في slot تاني (منع duplicate)
  const existingSlot = await findSlotByItemId(db, itemId);
  if (existingSlot) {
    return { slot: existingSlot, alreadyAssigned: true };
  }

  // جيب أقرب slot فاضي
  const slot = await findNextAvailableSlot(db);
  if (!slot) {
    const err = new Error("لا توجد slots متاحة. يرجى إضافة slots جديدة.");
    err.code = "NO_SLOTS_AVAILABLE";
    throw err;
  }

  // حجز الـ item في الـ slot (atomic مع race condition guard)
  const updatedSlot = await assignItemToSlot(db, itemId, slot._id);
  if (!updatedSlot) {
    // الـ slot اتملى بين findOne و update → retry مرة واحدة
    return assignToQueue(db, itemId);
  }

  // حدّث الـ boost_item: status = scheduled + scheduledAt
  await db.collection("boost_items").updateOne(
    { _id: itemObjId },
    {
      $set: {
        status: "scheduled",
        scheduledAt: `${updatedSlot.date} ${updatedSlot.time}`,
        priority: getBoostPriority({ isUrgent: false, status: "scheduled" }),
      },
      $push: {
        logs: {
          action: "assigned_to_queue",
          adminId: null,
          reason: `Slot: ${updatedSlot.date} ${updatedSlot.time}`,
          createdAt: new Date(),
        },
      },
    }
  );

  return { slot: updatedSlot, alreadyAssigned: false };
}

// ─── Process queue: جيب كل pending push/whatsapp وحطهم في slots ──────────────
export async function processQueue(db) {
  // تأكد إن في slots متاحة، لو لأ → seed أوتوماتيك
  const available = await findNextAvailableSlot(db);
  if (!available) {
    await seedSlots(db, { daysAhead: 7 });
  }

  // جيب كل pending items مرتبة بالـ priority (استبعاد الـ Urgent كما هو مطلوب في الـ Spec)
  const pendingItems = await db
    .collection("boost_items")
    .find({
      status: "pending",
      boostType: { $in: ["push", "whatsapp"] },
      urgent: { $ne: true }, // Urgent Push bypasses normal queue
    })
    .sort({ priority: -1, purchaseDate: 1 }) // urgent أول، ثم الأقدم
    .toArray();

  const results = { assigned: [], skipped: [], noSlots: false };

  for (const item of pendingItems) {
    // If we already know slots are full from a previous iteration in this loop
    if (results.noSlots) break;

    try {
      const { slot, alreadyAssigned } = await assignToQueue(db, item._id.toString());
      if (alreadyAssigned) {
        results.skipped.push({ itemId: item._id, reason: "already_in_slot" });
      } else {
        results.assigned.push({ itemId: item._id, slotId: slot._id, slot: `${slot.date} ${slot.time}` });
      }
    } catch (err) {
      if (err.code === "NO_SLOTS_AVAILABLE") {
        results.noSlots = true;
        break; // مفيش فايدة نكمل
      }
      results.skipped.push({ itemId: item._id, reason: err.message });
    }
  }

  return results;
}

// ─── Reschedule: شيل من slot القديم وحطه في الجديد ──────────────────────────
export async function rescheduleItem(db, itemId) {
  const itemObjId = new ObjectId(itemId);

  // شيله من slot القديم لو موجود
  const oldSlot = await removeItemFromSlot(db, itemId);

  // priority = 60 (rescheduled)
  await db.collection("boost_items").updateOne(
    { _id: itemObjId },
    {
      $set: {
        status: "pending",
        priority: 60,
      },
      $push: {
        logs: {
          action: "rescheduled",
          adminId: null,
          reason: oldSlot ? `Removed from slot: ${oldSlot.date} ${oldSlot.time}` : "No previous slot",
          createdAt: new Date(),
        },
      },
    }
  );

  // حطه في slot جديد
  return assignToQueue(db, itemId);
}

// ─── Handle failure: يرجع pending بأولوية أعلى ───────────────────────────────
export async function handleFailedItem(db, itemId) {
  const itemObjId = new ObjectId(itemId);

  // شيله من slot لو موجود
  await removeItemFromSlot(db, itemId);

  // priority = 80 (failed) → يرجع pending عشان processQueue يلتقطه
  await db.collection("boost_items").updateOne(
    { _id: itemObjId },
    {
      $set: {
        status: "pending",
        priority: 80,
        scheduledAt: null,
      },
      $push: {
        logs: {
          action: "returned_to_queue_after_failure",
          adminId: null,
          reason: "Re-queued with elevated priority",
          createdAt: new Date(),
        },
      },
    }
  );

  // أدخله في queue مباشرة
  return assignToQueue(db, itemId);
}

// ─── Cancel: شيل من slot وخلّي status machine يكمل ──────────────────────────
export async function removeFromQueue(db, itemId) {
  return removeItemFromSlot(db, itemId);
}
