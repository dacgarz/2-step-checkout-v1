import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                assetFileNames: "[name].[ext]",
                chunkFileNames: "[name].js",
                entryFileNames: "[name].js",
            },
        },
        commonjsOptions: {
            strictRequires: true,
        },
    },
});