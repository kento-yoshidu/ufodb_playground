import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import init from "../wasm/pkg/wasm.js";
import "ufodb-design-system/style.css";

// WASMの初期化はアプリ全体で1回だけ行い、終わってから描画する。
// useEffectの中で呼ぶと、StrictModeでinit()が2回同時に走ってインスタンスが2つでき、
// memory access out of bounds の原因になる
init().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
