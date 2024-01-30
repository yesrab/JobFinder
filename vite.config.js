import { defineConfig } from "vite";
import dotenv from "dotenv/config";
import react from "@vitejs/plugin-react";
const Port = process.env.PORT || 8080;
// console.log(Port)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": `http://localhost:${Port}`,
    },
  },
});

