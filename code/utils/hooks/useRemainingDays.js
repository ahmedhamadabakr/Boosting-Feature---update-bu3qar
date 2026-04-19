import { useMemo } from "react";

/**
 * Hook لحساب الأيام المتبقية من صلاحية الإعلان
 */
export default function useRemainingDays(post) {
  return useMemo(() => {
    if (!post || !post.validUntil) return Infinity;
    const now = new Date();
    const expiry = new Date(post.validUntil);
    const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }, [post]);
}
