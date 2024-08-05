import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     staleTime: 1000 * 60 * 5, // 5 minutes
  //   },
  // },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);

// react query caching
// when you use react query, it caches the data by default.
// stale : the data is stale when the data is fetched from the server but not refetched after the data is updated on the server.
// invalidation : the process of removing the stale data from the cache is called invalidation.
// refetching : the process of fetching the data from the server is called refetching.
// staleTime : the time in milliseconds after which the data is considered stale.
// cacheTime : the time in milliseconds after which the data is removed from the cache.
// staleTime and cacheTime are the options that can be passed to the useQuery hook.
