import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "INVALID_ANNOTATION" && warning.id?.includes("gantt-task-react")) {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          const normalizedId = id.replace(/\\/g, "/");

          if (normalizedId.includes("/react/") || normalizedId.includes("/react-dom/") || normalizedId.includes("/scheduler/")) {
            return "vendor-react";
          }
          if (normalizedId.includes("/gantt-task-react/")) {
            return "vendor-gantt";
          }
          if (normalizedId.includes("/xlsx/")) {
            return "vendor-xlsx";
          }
          if (normalizedId.includes("/jspdf/") || normalizedId.includes("/dompurify/")) {
            return "vendor-pdf";
          }
          if (normalizedId.includes("/html2canvas/")) {
            return "vendor-canvas";
          }
          if (normalizedId.includes("/date-fns/") || normalizedId.includes("/uuid/")) {
            return "vendor-utils";
          }

          return "vendor";
        }
      }
    }
  }
});
