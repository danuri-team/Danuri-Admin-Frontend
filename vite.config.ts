import { defineConfig } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    sentryVitePlugin({
      org: "soongsil-university-uz",
      project: "javascript-react-bc",
    }),
  ],
  server: {
    port: 3000,
  },
});
