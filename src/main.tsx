import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import init, { Ufdb } from "../wasm/pkg/wasm.js";
import App from "./App.tsx";
import "ufodb-design-system/style.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "always",
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
    mutations: {
      networkMode: "always",
    },
  },
});

// WASMの初期化はアプリ全体で1回だけ行い、終わってから描画する。
// useEffectの中で呼ぶと、StrictModeでinit()が2回同時に走ってインスタンスが2つでき、
// memory access out of bounds の原因になる
init().then(() => {
  // Ufdbはinit()のあとでないと作れない。タブ内のデータはすべてこの1個に入るので、
  // ここで1回だけ作ってAppに渡す
  const ufdb = new Ufdb();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App ufdb={ufdb} />
      </QueryClientProvider>
    </StrictMode>,
  );
});
