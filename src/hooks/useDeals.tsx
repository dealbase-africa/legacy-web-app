import { Deal, generateTraceId, ServerResponse } from "@dealbase/core";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { config } from "src/lib/config";
import { useFilterStore } from "src/stores/filter";
import { shallow } from "zustand/shallow";

export function useDeals(): Omit<UseQueryResult, "refetch" | "data"> & {
  deals: Deal[] | undefined;
  refetchDeals: () => void;
} {
  const filter = useFilterStore((state) => state.filter, shallow);

  const stringifiedFilter = JSON.stringify(filter);

  const { data, refetch, ...rest } = useQuery<ServerResponse<Deal>>({
    queryKey: ["deals", stringifiedFilter],
    queryFn: () =>
      fetch(`/api/deals?filter=${stringifiedFilter}`, {
        headers: {
          "x-trace-id": generateTraceId(),
          "x-auth-token": process.env.NEXT_PUBLIC_X_AUTH_TOKEN as string,
          authorization: `Bearer ${config.apiKey}`,
        },
      }).then((res) => res.json()),
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return useMemo(
    () => ({
      refetchDeals: refetch,
      deals: data?.data as Deal[],
      ...rest,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );
}
