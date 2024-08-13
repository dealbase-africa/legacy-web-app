import { useAuthHeaders } from "@dealbase/client";
import { generateTraceId } from "@dealbase/core";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { ReturnType } from "src/pages/api/users";

export function useUserPermissions(): Omit<
  UseQueryResult,
  "refetch" | "data"
> & {
  permissions: string[];
  refetchPermissions: () => void;
} {
  const authHeaders = useAuthHeaders();

  const { data, refetch, ...rest } = useQuery<ReturnType>({
    queryKey: ["permissions"],
    queryFn: () =>
      fetch(`/api/users`, {
        headers: {
          "x-trace-id": generateTraceId(),
          ...(authHeaders || {}),
        },
      }).then((res) => res.json()),
    enabled: !!authHeaders,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (authHeaders) refetch();
  }, [authHeaders, refetch]);

  return {
    refetchPermissions: refetch,
    permissions: data?.permissions || [],
    ...rest,
  };
}
