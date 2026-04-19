import { getMongoDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * API endpoint مخصص للتحقق من كوبونات تمييز الإعلان
 * يدور في مصدرين:
 *   1. coupons collection بـ category: "featured-post"  (من /admin/coupons/featured-post)
 *   2. tokens collection بـ type: "postCouponVerify"    (من /admin/packages/featured-post)
 * لا يشترط packageId ولا يحذف الكوبون عند التحقق
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const { coupon, userId } = req.body;

  if (!coupon || coupon.length < 4) {
    return res.status(400).json({ error: { message: "كود الخصم غير صحيح" } });
  }

  if (!userId) {
    return res.status(400).json({ error: { message: "مستخدم غير معروف" } });
  }

  try {
    const db = await getMongoDb();
    const code = coupon.toLowerCase();

    // ── المصدر الأول: coupons collection (من /admin/coupons/featured-post) ──
    const adminCoupon = await db.collection("coupons").findOne({
      _id: code,
      category: "featured-post",
    });

    if (adminCoupon) {
      // التحقق من انتهاء الصلاحية
      if (adminCoupon.expiresAt && new Date(adminCoupon.expiresAt) < new Date()) {
        return res.status(400).json({ error: { message: "كود الخصم منتهي الصلاحية" } });
      }
      // التحقق من الاستخدام المسبق
      const usedBy = adminCoupon.usedBy || [];
      const alreadyUsed = usedBy.some((id) => {
        try { return new ObjectId(id).equals(new ObjectId(userId)); }
        catch { return String(id) === String(userId); }
      });
      if (alreadyUsed) {
        return res.status(400).json({ error: { message: "لقد استخدمت هذا الكوبون من قبل" } });
      }
      if (usedBy.length >= adminCoupon.usageLimit) {
        return res.status(400).json({ error: { message: "انتهى عدد مرات استخدام هذا الكوبون" } });
      }
      return res.status(200).json({ discount: adminCoupon.discount, code: adminCoupon.code });
    }

    // ── المصدر الثاني: tokens collection بكل الاحتمالات ──
    // nanoid(6) بيولد mixed case، والـ CouponInput بيعمل toUpperCase
    // فبندور بـ case-insensitive regex
    const token = await db.collection("tokens").findOne({
      _id: { $regex: new RegExp(`^${coupon}$`, "i") },
      type: "postCouponVerify",
    });

    if (token) {
      if (token.expireAt && new Date(token.expireAt) < new Date()) {
        return res.status(400).json({ error: { message: "كود الخصم منتهي الصلاحية" } });
      }
      return res.status(200).json({ discount: token.discount, code: token._id });
    }

    return res.status(400).json({ error: { message: "كود الخصم غير صحيح أو غير متاح لتمييز الإعلانات" } });
  } catch (error) {
    return res.status(500).json({ error: { message: "حدث خطأ أثناء التحقق من الكوبون" } });
  }
}
