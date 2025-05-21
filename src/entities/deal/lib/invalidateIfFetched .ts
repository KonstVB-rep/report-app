import { QueryClient, QueryKey } from "@tanstack/react-query";

export const invalidateIfFetched = (
  queryClient: QueryClient,
  key: QueryKey
) => {
  const state = queryClient.getQueryState(key);
  if (state?.status === "success" || state?.status === "error") {
    queryClient.invalidateQueries({ queryKey: key });
  }
};
