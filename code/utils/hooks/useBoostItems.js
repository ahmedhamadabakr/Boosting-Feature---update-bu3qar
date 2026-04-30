import { useState, useEffect, useCallback } from "react";
import { fetcher } from "@/lib/fetch";

export default function useBoostItems(filters = {}) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      ).toString();

      const res = await fetcher(`/api/admin/boost-items${params ? `?${params}` : ""}`);
      setData(res?.data || []);
    } catch (e) {
      setError(e?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
