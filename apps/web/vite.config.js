import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite + React setup. No SSR — this builds to static
// HTML/JS/CSS that gets deployed to S3 + served via CloudFront (see
// docs/ARCHITECTURE.md, matches Section 33 of the brief).
export default defineConfig({
  plugins: [react()],
});
