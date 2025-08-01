import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/numbers-test/", // замените на имя репозитория
  plugins: [react()],
});
