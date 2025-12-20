import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: [
        "black.svg",
        "white.svg",
        "app-icon.svg",
        "assets/*.svg",
        "assets/*.png",
        "assets/*.jpg",
      ],
      manifest: {
        name: "Roni Koshel - כושר ותזונה",
        short_name: "Roni Koshel",
        description: "רוני קושל - כושר ותזונה אונליין",
        theme_color: "#1f6fae",
        background_color: "#000000",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "app-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    port: 4200,
  },
  optimizeDeps: {
    include: [
      "@emotion/react",
      "@emotion/cache",
      "@emotion/styled",
      "@mui/material",
      "@mui/icons-material",
    ],
    exclude: ["swiper"],
  },
});
