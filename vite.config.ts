import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/ufodb_playground/",
  // ビルドした日時をJSに埋め込む（CIではビルド直後にデプロイするので、デプロイ日時として表示する）
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
