import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // замените на имя репозитория
  plugins: [react()],
});
