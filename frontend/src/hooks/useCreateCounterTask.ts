import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CounterTaskBody } from "../types/ad.types";

export function useCreateCounterTask(adId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CounterTaskBody) => {
      const res = await fetch(`/api/ads/${adId}/counter-task`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to create task");
      return res.json() as Promise<{ id: string; duplicate?: boolean }>;
    },
    onSuccess: () => {
      // could refetch ad details if tasks are displayed in UI
      qc.invalidateQueries();
    },
  });
}

