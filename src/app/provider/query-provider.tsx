import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchInterval: 60 * 1000 * 5,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;
export const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
};

const QueryProvider = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
