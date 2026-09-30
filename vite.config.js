import { defineConfig } from "vite";

// Vite is only the local dev/preview server. Production builds copy source bytes.
export default defineConfig({
  root: "site",
  publicDir: false,
  build: { outDir: "../dist" },
});
